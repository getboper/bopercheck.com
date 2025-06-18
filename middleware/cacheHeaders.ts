import type { Request, Response, NextFunction } from 'express';

export function addCacheBustingHeaders(req: Request, res: Response, next: NextFunction) {
  // Set aggressive cache-busting headers for all responses
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    'Last-Modified': new Date().toUTCString()
  });
  
  next();
}

export function addVersionHeaders(req: Request, res: Response, next: NextFunction) {
  // Add version hash to prevent cached versions
  const version = Date.now().toString(36);
  res.set({
    'X-App-Version': version,
    'X-Build-Time': new Date().toISOString()
  });
  
  next();
}