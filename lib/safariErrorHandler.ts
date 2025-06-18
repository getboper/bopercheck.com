// Safari-specific error handling and cache clearing system
export class SafariErrorHandler {
  private static instance: SafariErrorHandler;
  private errorCount = 0;
  private maxErrors = 3;
  private hasShownClearCachePrompt = false;

  static getInstance(): SafariErrorHandler {
    if (!SafariErrorHandler.instance) {
      SafariErrorHandler.instance = new SafariErrorHandler();
    }
    return SafariErrorHandler.instance;
  }

  // Detect Safari browser
  private isSafari(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('firefox');
  }

  // Detect mobile Safari
  private isMobileSafari(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return this.isSafari() && (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod'));
  }

  // Clear various types of Safari caches
  private async clearSafariCache(): Promise<void> {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear IndexedDB if available
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases?.() || [];
        for (const db of databases) {
          if (db.name) {
            const deleteReq = indexedDB.deleteDatabase(db.name);
            await new Promise((resolve) => {
              deleteReq.onsuccess = () => resolve(void 0);
              deleteReq.onerror = () => resolve(void 0);
            });
          }
        }
      }

      // Clear service worker cache if available
      if ('serviceWorker' in navigator && 'caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      console.log('Safari caches cleared successfully');
    } catch (error) {
      console.warn('Error clearing Safari cache:', error);
    }
  }

  // Show Safari-specific cache clearing instructions
  private showSafariClearCacheInstructions(): void {
    if (this.hasShownClearCachePrompt) return;
    this.hasShownClearCachePrompt = true;

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      ">
        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
          Safari Cache Issue Detected
        </h3>
        <p style="margin: 0 0 20px 0; color: #6b7280; line-height: 1.5; font-size: 14px;">
          We've detected repeated errors that may be caused by Safari's cache. To fix this:
        </p>
        <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
          <li>Go to Settings → Safari</li>
          <li>Scroll down and tap "Clear History and Website Data"</li>
          <li>Confirm by tapping "Clear History and Data"</li>
          <li>Return to BoperCheck and try again</li>
        </ol>
        <div style="display: flex; gap: 12px;">
          <button id="clearCacheBtn" style="
            flex: 1;
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          ">Try Auto-Clear</button>
          <button id="dismissBtn" style="
            flex: 1;
            background: #f3f4f6;
            color: #374151;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          ">Continue</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const clearBtn = modal.querySelector('#clearCacheBtn') as HTMLButtonElement;
    const dismissBtn = modal.querySelector('#dismissBtn') as HTMLButtonElement;

    clearBtn.addEventListener('click', async () => {
      clearBtn.textContent = 'Clearing...';
      clearBtn.disabled = true;
      
      await this.clearSafariCache();
      
      // Force page reload after clearing cache
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });

    dismissBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 30000);
  }

  // Handle JavaScript errors specifically for Safari
  public handleError(error: Error | string): void {
    if (!this.isSafari()) return;

    this.errorCount++;
    
    console.warn(`Safari error #${this.errorCount}:`, error);

    // Show cache clearing prompt after multiple errors
    if (this.errorCount >= this.maxErrors && this.isMobileSafari()) {
      this.showSafariClearCacheInstructions();
    }

    // Log error for debugging
    this.logErrorToServer(error);
  }

  // Log errors to server for monitoring
  private async logErrorToServer(error: Error | string): Promise<void> {
    try {
      await fetch('/api/platform-failures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'safari_cache_error',
          message: typeof error === 'string' ? error : error.message,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          errorCount: this.errorCount
        })
      });
    } catch (logError) {
      console.warn('Failed to log error to server:', logError);
    }
  }

  // Initialize Safari error handling
  public initialize(): void {
    if (!this.isSafari()) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error || event.message);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason);
    });

    // Safari-specific null safety wrapper for common operations
    this.addNullSafetyWrappers();

    console.log('Safari error handler initialized');
  }

  // Add null safety wrappers for common Safari issues
  private addNullSafetyWrappers(): void {
    // Wrap localStorage access
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      try {
        return originalSetItem.call(this, key, value);
      } catch (error) {
        console.warn('Safari localStorage error:', error);
        SafariErrorHandler.getInstance().handleError(error as Error);
      }
    };

    // Wrap JSON.parse for safer data handling
    const originalParse = JSON.parse;
    (window as any).safeJSONParse = function(text: string, fallback: any = null) {
      try {
        return originalParse(text);
      } catch (error) {
        console.warn('Safari JSON parse error:', error);
        SafariErrorHandler.getInstance().handleError(error as Error);
        return fallback;
      }
    };
  }

  // Force page refresh with cache busting
  public forceRefreshWithCacheBust(): void {
    const timestamp = Date.now();
    const url = new URL(window.location.href);
    url.searchParams.set('_cb', timestamp.toString());
    window.location.href = url.toString();
  }

  // Check if user should see cache clearing prompt
  public shouldShowCachePrompt(): boolean {
    return this.isMobileSafari() && this.errorCount >= this.maxErrors && !this.hasShownClearCachePrompt;
  }
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  SafariErrorHandler.getInstance().initialize();
}

export default SafariErrorHandler;