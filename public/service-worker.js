// Service worker to handle cache clearing and force fresh content
const CACHE_NAME = 'bopercheck-v' + Date.now();
const FORCE_REFRESH = true;

self.addEventListener('install', (event) => {
  // Force immediate activation
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Clear all caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Don't cache anything - always fetch from network
  event.respondWith(
    fetch(event.request, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    }).catch(() => {
      // If network fails, try to serve a helpful error page
      if (event.request.mode === 'navigate') {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>BoperCheck - Connection Issue</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .container { max-width: 500px; margin: 0 auto; }
              .btn { background: #3B82F6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>BoperCheck</h1>
              <p>Unable to load the page. This might be a caching issue.</p>
              <button class="btn" onclick="clearCacheAndReload()">Clear Cache & Retry</button>
              <p><small>Or try opening BoperCheck.com in incognito mode</small></p>
            </div>
            <script>
              function clearCacheAndReload() {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                    window.location.reload(true);
                  });
                } else {
                  window.location.reload(true);
                }
              }
            </script>
          </body>
          </html>
        `, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    })
  );
});

// Listen for messages to clear cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        // Notify clients that cache is cleared
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({type: 'CACHE_CLEARED'});
          });
        });
      })
    );
  }
});