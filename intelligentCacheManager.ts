import { Request, Response, NextFunction } from 'express';

// Intelligent cache management to help users without excessive popups
export class IntelligentCacheManager {
  
  // Smart cache headers that adapt based on user behavior
  static getAdaptiveCacheHeaders(req: Request): Record<string, string> {
    const userAgent = req.get('User-Agent') || '';
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    
    // For search engines and bots, allow minimal caching for performance
    if (isBot) {
      return {
        'Cache-Control': 'public, max-age=300, must-revalidate',
        'ETag': `"bopercheck-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      };
    }
    
    // For users, prevent aggressive caching that causes issues
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': `"fresh-${Date.now()}"`,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Vary': 'Accept-Encoding, User-Agent'
    };
  }
  
  // Middleware that applies intelligent cache prevention
  static applyIntelligentCaching(req: Request, res: Response, next: NextFunction) {
    const headers = IntelligentCacheManager.getAdaptiveCacheHeaders(req);
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Add cache-busting query parameter to asset requests
    if (req.url.includes('/assets/') || req.url.includes('.js') || req.url.includes('.css')) {
      const cacheBuster = `v=${Date.now()}`;
      if (!req.url.includes('?')) {
        req.url += `?${cacheBuster}`;
      } else if (!req.url.includes('v=')) {
        req.url += `&${cacheBuster}`;
      }
    }
    
    next();
  }
  
  // Check if user is experiencing cache issues without being intrusive
  static detectCacheIssues(req: Request): boolean {
    const userAgent = req.get('User-Agent') || '';
    const referer = req.get('Referer') || '';
    
    // Look for indicators of cache issues
    const indicators = [
      req.url.includes('error'),
      req.url.includes('retry'),
      referer.includes('error'),
      req.headers['x-cache-issues'] === 'true'
    ];
    
    return indicators.some(Boolean);
  }
  
  // Provide cache clearing assistance endpoint
  static handleCacheAssistance(req: Request, res: Response) {
    const userAgent = req.get('User-Agent') || '';
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    
    // Apply fresh headers
    const headers = IntelligentCacheManager.getAdaptiveCacheHeaders(req);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.json({
      success: true,
      cacheCleared: true,
      timestamp: Date.now(),
      userAgent: userAgent,
      recommendations: {
        mobile: isMobile ? [
          "Try opening in incognito/private mode",
          "Clear browser data in settings",
          "Force-close and reopen browser"
        ] : [],
        safari: isSafari ? [
          "Safari → Preferences → Privacy → Manage Website Data → Remove All",
          "Or use Safari → History → Clear History",
          "Consider switching to Chrome for better compatibility"
        ] : [],
        general: [
          "Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)",
          "Clear cookies and site data",
          "Disable browser extensions temporarily"
        ]
      },
      autoRedirect: true,
      redirectDelay: 3000
    });
  }
}

// Enhanced middleware for HTML pages to combat cached error pages
export function preventErrorCaching(req: Request, res: Response, next: NextFunction) {
  // More aggressive cache prevention for HTML pages
  if (req.accepts('html') && !req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('ETag', `"nocache-${Date.now()}-${Math.random()}"`);
    
    // Additional headers to prevent caching by proxies and CDNs
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('X-Accel-Expires', '0');
  }
  
  next();
}