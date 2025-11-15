import { Router, Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../db';

const router = Router();

/**
 * Health check endpoint
 * Returns system health status including database connectivity
 */
router.get('/health', async (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: 'unknown' as 'ok' | 'error' | 'unknown',
    },
  };

  // Check database connectivity
  try {
    await db.execute(sql`SELECT 1`);
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Readiness probe
 * Checks if the service is ready to accept traffic
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check database
    await db.execute(sql`SELECT 1`);
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: 'Database connection failed' });
  }
});

/**
 * Liveness probe
 * Checks if the service is alive
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

export default router;

