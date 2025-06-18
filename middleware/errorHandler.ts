import type { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function errorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    statusCode: error.statusCode
  });

  const statusCode = error.statusCode || 500;
  const response: any = {
    success: false,
    message: error.message || 'Internal server error'
  };

  if (error.code) {
    response.code = error.code;
  }

  if (error instanceof ValidationError && error.field) {
    response.field = error.field;
  }

  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    response.message = 'Internal server error';
  }

  res.status(statusCode).json(response);
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      throw new ValidationError(`${field} is required`, field);
    }
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

export function validateString(value: any, fieldName: string, maxLength?: number): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }
  
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }
  
  if (maxLength && trimmed.length > maxLength) {
    throw new ValidationError(`${fieldName} cannot exceed ${maxLength} characters`, fieldName);
  }
  
  return trimmed;
}