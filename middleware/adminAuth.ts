import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  admin?: boolean;
}

export function adminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Admin access required - missing token' });
  }

  // Simple admin token validation - in production this would be JWT or similar
  if (token === 'admin-token' || token === process.env.ADMIN_TOKEN) {
    req.admin = true;
    next();
  } else {
    return res.status(403).json({ error: 'Invalid admin token' });
  }
}

export function isAdminAuthenticated(req: AuthenticatedRequest): boolean {
  return req.admin === true;
}