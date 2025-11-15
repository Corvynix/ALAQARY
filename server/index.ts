import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityMiddleware, corsMiddleware } from "./middleware/security";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { validateEnv } from "./utils/env";

// Validate environment variables
validateEnv();

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// Security middleware (must be first)
app.use(securityMiddleware);
app.use(corsMiddleware);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
  limit: '10mb', // Limit payload size
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting for API routes
app.use('/api', apiLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handler (must be last)
  app.use(errorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.HOST || '0.0.0.0';
  
  const httpServer = server.listen({
    port,
    host,
    reusePort: false, // Disable reusePort on Windows
  } as any, () => {
    log(`serving on port ${port} at http://${host}:${port}`);
    log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`Health check: http://${host}:${port}/health`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    log(`\n${signal} received. Starting graceful shutdown...`);
    
    httpServer.close(() => {
      log('HTTP server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      log('Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    console.error(error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection: ${reason}`);
    console.error('Promise:', promise, 'Reason:', reason);
    gracefulShutdown('unhandledRejection');
  });
})();
