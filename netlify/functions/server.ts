import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import serverless from 'serverless-http';
import express, { Express } from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../../server/routes';
import { serveStatic } from '../../server/vite';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { securityMiddleware, corsMiddleware } from '../../server/middleware/security';
import { apiLimiter } from '../../server/middleware/rateLimiter';
import { errorHandler } from '../../server/middleware/errorHandler';
import { validateEnv } from '../../server/utils/env';

// Validate environment on cold start
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
}

let app: Express | null = null;
let serverlessHandler: any = null;

async function getApp(): Promise<Express> {
  if (app) {
    return app;
  }

  app = express();

  // Security middleware
  app.use(securityMiddleware);
  app.use(corsMiddleware);

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json({
    limit: '10mb',
  }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(cookieParser());

  // Rate limiting for API routes
  app.use('/api', apiLimiter);

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;

    res.on('finish', () => {
      const duration = Date.now() - start;
      if (path.startsWith('/api')) {
        console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
      }
    });

    next();
  });

  // Register routes
  const httpServer = createServer(app);
  await registerRoutes(app);

  // Error handler (must be last)
  app.use(errorHandler);

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  }

  return app;
}

// Netlify serverless function handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set timeout to maximum allowed by Netlify
  context.callbackWaitsForEmptyEventLoop = false;

  // Initialize app if not already done
  if (!serverlessHandler) {
    const expressApp = await getApp();
    serverlessHandler = serverless(expressApp, {
      binary: ['image/*', 'application/pdf'],
      request: (request: any, event: HandlerEvent, context: HandlerContext) => {
        // Add Netlify-specific headers
        request.netlify = {
          event,
          context,
        };
      },
    });
  }

  try {
    const result = await serverlessHandler(event, context);
    return result;
  } catch (error: any) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};

