// Cache Management Utility for BoperCheck
// Handles aggressive cache clearing on deployments

export class CacheManager {
  private static VERSION_KEY = 'bopercheck_app_version';
  private static CURRENT_VERSION = Date.now().toString();

  // Clear all browser storage
  static clearBrowserStorage(): void {
    try {
      // Clear localStorage
      if (typeof Storage !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Browser storage cleared');
      }

      // Clear IndexedDB
      if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        }).catch(e => console.log('IndexedDB clear failed:', e));
      }

      // Clear cookies for current domain
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });

    } catch (error) {
      console.error('Error clearing browser storage:', error);
    }
  }

  // Clear all caches via service worker
  static async clearServiceWorkerCaches(): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        console.log('All service worker caches cleared');
      } catch (error) {
        console.error('Error clearing service worker caches:', error);
      }
    }
  }

  // Send message to service worker for aggressive cache clearing
  static async messageServiceWorker(type: string): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const worker = registration.active;
        if (worker) {
          const messageChannel = new MessageChannel();
          
          return new Promise<void>((resolve) => {
            messageChannel.port1.onmessage = (event) => {
              console.log('Service worker response:', event.data);
              resolve();
            };
            
            worker.postMessage(
              { type }, 
              [messageChannel.port2]
            );
          });
        }
      } catch (error) {
        console.error('Error messaging service worker:', error);
      }
    }
  }

  // Check if app version has changed (indicating new deployment)
  static checkAppVersion(): boolean {
    try {
      const storedVersion = localStorage.getItem(this.VERSION_KEY);
      const hasVersionChanged = storedVersion !== this.CURRENT_VERSION;
      
      if (hasVersionChanged) {
        console.log('App version changed - clearing caches');
        localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking app version:', error);
      return false;
    }
  }

  // Force complete cache invalidation and reload
  static async forceRefresh(): Promise<void> {
    console.log('Forcing complete app refresh...');
    
    // Clear all browser storage
    this.clearBrowserStorage();
    
    // Clear service worker caches
    await this.clearServiceWorkerCaches();
    
    // Message service worker to clear everything
    await this.messageServiceWorker('FORCE_RELOAD');
    
    // Force hard reload
    if ('location' in window) {
      window.location.reload();
    }
  }

  // Initialize cache management on app startup
  static async initialize(): Promise<void> {
    console.log('Initializing cache management...');
    
    // Check if this is a new deployment
    if (this.checkAppVersion()) {
      console.log('New deployment detected - clearing old caches');
      
      // Clear old caches
      await this.clearServiceWorkerCaches();
      await this.messageServiceWorker('CLEAR_CACHE');
      
      // Clear browser storage except for auth data
      this.clearBrowserStorage();
    }

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'FORCE_RELOAD') {
          console.log('Service worker requested force reload');
          window.location.reload();
        }
        
        if (event.data && event.data.type === 'CLEAR_STORAGE') {
          console.log('Service worker requested storage clear');
          this.clearBrowserStorage();
        }
      });
    }
  }

  // Add cache-busting parameters to URLs
  static addCacheBuster(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_cb=${this.CURRENT_VERSION}`;
  }

  // Create no-cache fetch options
  static getNoCacheFetchOptions(): RequestInit {
    return {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    };
  }
}