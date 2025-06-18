import { apiRequest } from "@/lib/queryClient";

interface BrowserInfo {
  browser: string;
  version: string;
  os: string;
  mobile: boolean;
}

interface NetworkInfo {
  connectionType: string;
  downlink?: number;
  effectiveType?: string;
}

interface PlatformFailureData {
  failureType: 'site_load' | 'api_timeout' | 'frontend_error' | 'firebase_error' | 'critical_js_error';
  errorMessage: string;
  errorStack?: string;
  url: string;
  apiEndpoint?: string;
  httpStatus?: number;
  pageLoadTime?: number;
  browserInfo: BrowserInfo;
  networkInfo?: NetworkInfo;
  sessionId: string;
}

// Generate session ID for tracking user sessions
let sessionId = '';
if (typeof window !== 'undefined') {
  sessionId = sessionStorage.getItem('session_id') || generateSessionId();
  sessionStorage.setItem('session_id', sessionId);
}

function generateSessionId(): string {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getBrowserInfo(): BrowserInfo {
  if (typeof navigator === 'undefined') {
    return { browser: 'unknown', version: 'unknown', os: 'unknown', mobile: false };
  }

  const userAgent = navigator.userAgent;
  let browser = 'unknown';
  let version = 'unknown';
  let os = 'unknown';
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
    version = userAgent.match(/Chrome\/([0-9]+)/)?.[1] || 'unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    version = userAgent.match(/Firefox\/([0-9]+)/)?.[1] || 'unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    version = userAgent.match(/Version\/([0-9]+)/)?.[1] || 'unknown';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
    version = userAgent.match(/Edg\/([0-9]+)/)?.[1] || 'unknown';
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS')) {
    os = 'iOS';
  }

  return { browser, version, os, mobile };
}

function getNetworkInfo(): NetworkInfo | undefined {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return undefined;
  }

  const connection = (navigator as any).connection;
  return {
    connectionType: connection.type || 'unknown',
    downlink: connection.downlink,
    effectiveType: connection.effectiveType
  };
}

// Track platform failures with detailed context
export async function trackPlatformFailure(failureData: Partial<PlatformFailureData>) {
  try {
    const fullFailureData: PlatformFailureData = {
      failureType: failureData.failureType || 'frontend_error',
      errorMessage: failureData.errorMessage || 'Unknown error',
      errorStack: failureData.errorStack,
      url: window.location.href,
      apiEndpoint: failureData.apiEndpoint,
      httpStatus: failureData.httpStatus,
      pageLoadTime: failureData.pageLoadTime || performance.now(),
      browserInfo: getBrowserInfo(),
      networkInfo: getNetworkInfo(),
      sessionId
    };

    await apiRequest("POST", "/api/platform-failures", fullFailureData);
  } catch (error) {
    // Fail silently to avoid infinite error loops
    console.warn('Failed to track platform failure:', error);
  }
}

// Global error handler for uncaught JavaScript errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    trackPlatformFailure({
      failureType: 'critical_js_error',
      errorMessage: event.message,
      errorStack: event.error?.stack,
      url: event.filename || window.location.href
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackPlatformFailure({
      failureType: 'critical_js_error',
      errorMessage: 'Unhandled promise rejection: ' + (event.reason?.message || event.reason),
      errorStack: event.reason?.stack
    });
  });

  // Track page load performance and failures
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    
    // If page takes longer than 10 seconds to load, consider it a failure
    if (loadTime > 10000) {
      trackPlatformFailure({
        failureType: 'site_load',
        errorMessage: `Slow page load: ${Math.round(loadTime)}ms`,
        pageLoadTime: loadTime
      });
    }
  });

  // Track navigation errors
  window.addEventListener('beforeunload', () => {
    // Check if there are any pending network requests that might indicate a hang
    if (performance.getEntriesByType('navigation').length > 0) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation.loadEventEnd === 0) {
        trackPlatformFailure({
          failureType: 'site_load',
          errorMessage: 'Page did not complete loading',
          pageLoadTime: performance.now()
        });
      }
    }
  });
}

// Track API failures with automatic retry logic
export function trackApiFailure(url: string, status: number, errorMessage: string) {
  trackPlatformFailure({
    failureType: 'api_timeout',
    errorMessage: `API failure: ${errorMessage}`,
    apiEndpoint: url,
    httpStatus: status
  });
}

// Track Firebase errors
export function trackFirebaseError(operation: string, errorMessage: string) {
  trackPlatformFailure({
    failureType: 'firebase_error',
    errorMessage: `Firebase ${operation}: ${errorMessage}`
  });
}

// Monitor for blank page issues
if (typeof window !== 'undefined') {
  setTimeout(() => {
    // Check if the main content has loaded
    const mainContent = document.querySelector('main, #root, .app, body > div');
    if (!mainContent || mainContent.children.length === 0) {
      trackPlatformFailure({
        failureType: 'site_load',
        errorMessage: 'Blank page detected - no main content rendered',
        pageLoadTime: performance.now()
      });
    }
  }, 5000); // Check after 5 seconds
}

// Enhanced fetch wrapper to track API failures
const originalFetch = window.fetch;
if (typeof window !== 'undefined') {
  window.fetch = async function(...args: Parameters<typeof fetch>) {
    const startTime = performance.now();
    const url = args[0].toString();
    
    try {
      const response = await originalFetch.apply(this, args);
      const duration = performance.now() - startTime;
      
      // Track slow API calls (over 30 seconds)
      if (duration > 30000) {
        trackApiFailure(url, response.status, `Slow API response: ${Math.round(duration)}ms`);
      }
      
      // Track HTTP error responses
      if (!response.ok) {
        trackApiFailure(url, response.status, `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      trackApiFailure(url, 0, `Network error after ${Math.round(duration)}ms: ${error}`);
      throw error;
    }
  };
}