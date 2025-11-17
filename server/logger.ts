import pino from "pino";

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Centralized Pino logger instance used across the entire application.
 * 
 * Features:
 * - Structured logging with JSON output in production
 * - Pretty-printed colorized output in development
 * - Request correlation ID support via 'requestId' field
 * - Automatic timestamp formatting
 * - Configurable log levels via LOG_LEVEL environment variable
 * 
 * Usage:
 * ```typescript
 * import { logger } from './logger';
 * 
 * logger.info({ requestId: req.id, userId: '123' }, 'User login successful');
 * logger.error({ requestId: req.id, error }, 'Failed to process payment');
 * ```
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport: !isProduction ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    }
  } : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  base: {
    env: process.env.NODE_ENV || 'development',
  },
});

/**
 * Helper to create a child logger with a request correlation ID
 * 
 * @param requestId - Unique request identifier (usually from req.id)
 * @returns Child logger instance with requestId bound
 */
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}

/**
 * Helper to sanitize error objects for logging (removes stack traces in production)
 * 
 * @param error - Error object to sanitize
 * @returns Sanitized error object safe for logging
 */
export function sanitizeError(error: any): object {
  if (!error) return {};
  
  if (isProduction) {
    return {
      message: error.message || 'An error occurred',
      name: error.name || 'Error',
      ...(error.code && { code: error.code }),
    };
  }
  
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
    ...(error.code && { code: error.code }),
  };
}
