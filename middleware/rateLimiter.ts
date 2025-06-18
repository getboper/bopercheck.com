import type { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function createRateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyGenerator = (req) => req.ip || 'anonymous' } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      const entries = Array.from(requestCounts.entries());
      for (const [k, v] of entries) {
        if (now > v.resetTime) {
          requestCounts.delete(k);
        }
      }
    }

    const record = requestCounts.get(key);
    
    if (!record || now > record.resetTime) {
      requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    record.count++;
    next();
  };
}

export const priceCheckRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10
});

export const businessOutreachRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5
});

export const adminRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50
});