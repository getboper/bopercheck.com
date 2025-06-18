// Comprehensive cache management utilities

export class CacheManager {
  private static readonly STORAGE_KEY = 'bopercheck_cache_status';
  private static readonly CLEAR_TIMESTAMP_KEY = 'bopercheck_last_clear';

  // Check if the user has cache issues
  static hasLoadingIssues(): boolean {
    try {
      const issues = localStorage.getItem('bopercheck_loading_issues');
      const lastClear = localStorage.getItem(this.CLEAR_TIMESTAMP_KEY);
      const now = Date.now();
      
      // Consider issues resolved if cache was cleared recently (within 1 hour)
      if (lastClear && now - parseInt(lastClear) < 3600000) {
        return false;
      }
      
      return issues === 'true';
    } catch {
      return false;
    }
  }

  // Mark that loading issues have occurred
  static markLoadingIssues(): void {
    try {
      localStorage.setItem('bopercheck_loading_issues', 'true');
    } catch {
      // Ignore if localStorage is not available
    }
  }

  // Clear all types of browser cache
  static async clearAllCache(): Promise<void> {
    try {
      // Clear Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
      }

      // Clear Cache API
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Clear Storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear IndexedDB
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return this.deleteDatabase(db.name);
            }
          })
        );
      }

      // Mark cache as cleared
      localStorage.setItem(this.CLEAR_TIMESTAMP_KEY, Date.now().toString());
      
    } catch (error) {
      console.error('Cache clearing failed:', error);
      throw error;
    }
  }

  // Delete IndexedDB database
  private static deleteDatabase(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(name);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onblocked = () => {
        // Force resolve after timeout if blocked
        setTimeout(() => resolve(), 2000);
      };
    });
  }

  // Force reload with cache bypass
  static forceReload(): void {
    const url = new URL(window.location.href);
    url.searchParams.set('nocache', Date.now().toString());
    window.location.href = url.toString();
  }

  // Check if the current load is fresh
  static isFreshLoad(): boolean {
    const params = new URLSearchParams(window.location.search);
    return params.has('nocache') || params.has('fresh') || params.has('v');
  }

  // Add cache-busting parameters to a URL
  static addCacheBuster(url: string): string {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('v', Date.now().toString());
    return urlObj.toString();
  }

  // Initialize cache monitoring
  static initializeMonitoring(): void {
    // Monitor for network errors
    window.addEventListener('error', (event) => {
      if (event.target instanceof HTMLScriptElement || 
          event.target instanceof HTMLLinkElement ||
          event.target instanceof HTMLImageElement) {
        this.markLoadingIssues();
      }
    });

    // Monitor for fetch failures
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok && response.status >= 400) {
          this.markLoadingIssues();
        }
        return response;
      } catch (error) {
        this.markLoadingIssues();
        throw error;
      }
    };

    // Monitor for unhandled promise rejections
    window.addEventListener('unhandledrejection', () => {
      this.markLoadingIssues();
    });
  }

  // Get cache status for debugging
  static async getCacheStatus(): Promise<object> {
    const status = {
      hasLoadingIssues: this.hasLoadingIssues(),
      isFreshLoad: this.isFreshLoad(),
      lastClear: localStorage.getItem(this.CLEAR_TIMESTAMP_KEY),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      serviceWorkersCount: 0,
      cachesCount: 0
    };

    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        status.serviceWorkersCount = registrations.length;
      }

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        status.cachesCount = cacheNames.length;
      }
    } catch {
      // Ignore errors in status collection
    }

    return status;
  }
}

// Initialize monitoring when the module loads
if (typeof window !== 'undefined') {
  CacheManager.initializeMonitoring();
}