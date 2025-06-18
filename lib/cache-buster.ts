// Cache busting utilities to prevent users seeing stale store data

export function clearAllCaches() {
  // Clear localStorage entries that might contain cached data
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.includes('price') || 
    key.includes('store') || 
    key.includes('analysis') ||
    key.includes('cache')
  );
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear browser cache using Cache API if available
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    });
  }
}

export function generateCacheBuster(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Clear caches when the page loads to prevent stale data
if (typeof window !== 'undefined') {
  // Clear on page load
  window.addEventListener('load', clearAllCaches);
  
  // Clear on page visibility change (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      clearAllCaches();
    }
  });
}