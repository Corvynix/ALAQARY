import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pino from "pino";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { pool } from "./db";

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport: !isProduction ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    }
  } : undefined,
});

function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'SESSION_SECRET',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    logger.error({ missing }, 'Missing required environment variables');
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (isProduction) {
    const productionRequired = ['ADMIN_INIT_SECRET'];
    const productionMissing = productionRequired.filter(key => !process.env[key]);
    
    if (productionMissing.length > 0) {
      logger.error({ missing: productionMissing }, 'Missing required production environment variables');
      throw new Error(`Missing required production environment variables: ${productionMissing.join(', ')}`);
    }
    
    const forbiddenPlaceholders = ['CHANGE_ME_IN_PRODUCTION', 'admin', 'secret'];
    if (forbiddenPlaceholders.includes(process.env.ADMIN_INIT_SECRET || '')) {
      logger.error('ADMIN_INIT_SECRET contains forbidden placeholder value');
      throw new Error('ADMIN_INIT_SECRET must be set to a secure, unique value in production');
    }
  }
  
  if (process.env.STRIPE_SECRET_KEY) {
    if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      logger.error('STRIPE_SECRET_KEY has invalid format');
      throw new Error('STRIPE_SECRET_KEY must start with "sk_" - please verify your Stripe secret key');
    }
    logger.info('Stripe integration detected and validated');
  }
  
  if (!process.env.GEMINI_API_KEY) {
    logger.warn('GEMINI_API_KEY not set - AI features may not be available');
  } else {
    logger.info('Gemini AI integration detected');
  }
  
  if (isProduction && !process.env.SENTRY_DSN_SERVER) {
    logger.warn('SENTRY_DSN_SERVER not set - error tracking will not be available in production');
  }
  
  logger.info('Environment variables validated successfully');
}

app.use(helmet({
  contentSecurityPolicy: !isProduction ? false : {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

app.use(compression());

app.use(cors({
  origin: isProduction 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || false)
    : true,
  credentials: true,
}));

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown;
    id: string;
  }
}

app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    
    if (req.path.startsWith("/api")) {
      logger.info({
        requestId: req.id,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userAgent: req.headers['user-agent'],
      }, 'API request');
    }
  });

  next();
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn({
      requestId: req.id,
      ip: req.ip,
      path: req.path,
    }, 'Rate limit exceeded');
    res.status(429).json({
      message: "Too many requests from this IP, please try again later.",
      requestId: req.id,
    });
  },
});

app.use('/api', globalLimiter);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      environment: process.env.NODE_ENV,
    };
    
    res.status(200).json(health);
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/health/ready', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch (error) {
    logger.error({ error }, 'Readiness check failed');
    res.status(503).json({ ready: false });
  }
});

(async () => {
  try {
    validateEnvironment();
    
    const server = await registerRoutes(app);

    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      logger.error({
        requestId: req.id,
        error: err,
        stack: err.stack,
        path: req.path,
        method: req.method,
      }, 'Request error');

      res.status(status).json({ 
        message,
        requestId: req.id,
      });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = parseInt(process.env.PORT || '5000', 10);
    
    const serverInstance = server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      logger.info({ port, environment: process.env.NODE_ENV }, 'Server started successfully');
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info({ signal }, 'Graceful shutdown initiated');
      
      serverInstance.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await pool.end();
          logger.info('Database pool closed');
          
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error({ error }, 'Error during shutdown');
          process.exit(1);
        }
      });
      
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error({ reason, promise }, 'Unhandled Promise Rejection');
    });
    
    process.on('uncaughtException', (error) => {
      logger.error({ error }, 'Uncaught Exception');
      gracefulShutdown('uncaughtException');
    });
    
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
})();
