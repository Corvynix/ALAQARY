import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { CustomError } from './errorHandler';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation Error',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation Error',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation Error',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

