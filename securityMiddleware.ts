import type { Request, Response, NextFunction } from 'express';
import { createAdminAlert, logSystemError } from './adminRealtimeRoutes';

// Known attack patterns and malicious paths
const BLOCKED_PATHS = [
  '/wp-admin',
  '/wordpress',
  '/wp-content',
  '/wp-includes',
  '/administrator',
  '/phpMyAdmin',
  '/mysql',
  '/phpmyadmin',
  '/.env',
  '/config',
  '/server-status',
  '/server-info',
  '/.git',
  '/backup',
  '/backups',
  '/old',
  '/staging',
  '/dev',
  '/debug'
];

// Suspicious user agents (bots, scrapers, vulnerability scanners)
const BLOCKED_USER_AGENTS = [
  'nikto',
  'sqlmap',
  'nmap',
  'masscan',
  'nessus',
  'openvas',
  'w3af',
  'skipfish',
  'gobuster',
  'dirb',
  'dirbuster',
  'wpscan',
  'joomscan',
  'droopescan'
];

// Rate limiting for suspicious activity
const requestCounts = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 100; // Increased to allow normal browsing

export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || '';
  const requestPath = req.path.toLowerCase();

  // Whitelist legitimate admin API endpoints
  const legitimateAdminPaths = [
    '/api/admin/email-test',
    '/api/admin/bulk-email',
    '/api/admin/send-apology',
    '/api/admin/metrics',
    '/api/admin/alerts',
    '/api/admin/system-errors',
    '/api/admin/trigger-bulk-apologies',
    '/api/admin/error-stats',
    '/api/admin/recent-visitors',
    '/api/admin/test-email-setup',
    '/api/admin/test-apology-email',
    '/api/test-auto-healing',
    '/api/report-error'
  ];

  const isLegitimateAdmin = legitimateAdminPaths.some(path => 
    requestPath === path.toLowerCase() || requestPath.startsWith(path.toLowerCase())
  );

  // Check for blocked paths, but skip if it's a legitimate admin API
  if (!isLegitimateAdmin) {
    for (const blockedPath of BLOCKED_PATHS) {
      if (requestPath.includes(blockedPath.toLowerCase())) {
        logSecurityIncident(clientIP, userAgent, requestPath, 'blocked_path');
        return res.status(404).json({ error: 'Not found' });
      }
    }
  }

  // Check for suspicious user agents
  const suspiciousAgent = BLOCKED_USER_AGENTS.some(agent => 
    userAgent.toLowerCase().includes(agent)
  );
  
  if (suspiciousAgent) {
    logSecurityIncident(clientIP, userAgent, requestPath, 'blocked_user_agent');
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Skip rate limiting for static assets and legitimate browsers
  const skipRateLimit = 
    requestPath.includes('.js') ||
    requestPath.includes('.css') ||
    requestPath.includes('.png') ||
    requestPath.includes('.jpg') ||
    requestPath.includes('.ico') ||
    requestPath.includes('.svg') ||
    requestPath.includes('_vite') ||
    userAgent.includes('Mozilla') ||
    userAgent.includes('Chrome') ||
    userAgent.includes('Safari') ||
    userAgent.includes('Firefox');

  if (!skipRateLimit) {
    // Rate limiting only for suspicious traffic
    const now = Date.now();
    const requestData = requestCounts.get(clientIP);
    
    if (requestData) {
      if (now - requestData.lastReset > RATE_LIMIT_WINDOW) {
        requestCounts.set(clientIP, { count: 1, lastReset: now });
      } else {
        requestData.count++;
        if (requestData.count > MAX_REQUESTS_PER_MINUTE) {
          console.log(`Rate limit exceeded for suspicious IP: ${clientIP}`);
          return res.status(429).json({ error: 'Too many requests' });
        }
      }
    } else {
      requestCounts.set(clientIP, { count: 1, lastReset: now });
    }
  }

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupRateLimitData();
  }

  next();
}

function logSecurityIncident(ip: string, userAgent: string, path: string, type: string) {
  const incident = {
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    path,
    type,
    severity: 'medium'
  };

  console.log(`Security incident: ${type} from ${ip} - ${path}`);
  
  // Skip admin alert logging to prevent database errors for now
  // Focus on console logging for security monitoring
}

function cleanupRateLimitData() {
  const now = Date.now();
  const entries = Array.from(requestCounts.entries());
  for (const [ip, data] of entries) {
    if (now - data.lastReset > RATE_LIMIT_WINDOW * 2) {
      requestCounts.delete(ip);
    }
  }
}

// Additional middleware for API protection
export function apiSecurityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Block common API attack patterns
  const suspiciousPatterns = [
    '../../',
    '../',
    '<script',
    'javascript:',
    'data:',
    'vbscript:',
    'onload=',
    'onclick=',
    'onerror='
  ];

  const queryString = req.url;
  const body = JSON.stringify(req.body);

  for (const pattern of suspiciousPatterns) {
    if (queryString.includes(pattern) || body.includes(pattern)) {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      logSecurityIncident(clientIP, req.get('User-Agent') || '', req.path, 'injection_attempt');
      return res.status(400).json({ error: 'Invalid request' });
    }
  }

  next();
}

// Middleware to log legitimate traffic for analytics
export function analyticsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only log legitimate traffic (not blocked requests)
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || '';
  const referer = req.get('Referer') || '';
  
  // Skip logging for static assets and API calls that are too frequent
  const skipPaths = ['/favicon.ico', '/robots.txt', '/sitemap.xml'];
  if (!skipPaths.includes(req.path)) {
    // This creates the traffic that should appear in your dashboard
    try {
      // Log to your internal analytics system
      console.log(`Analytics: ${req.method} ${req.path} from ${clientIP}`);
    } catch (error) {
      // Silent fail for analytics
    }
  }

  next();
}