// SERVICE WORKER - VACH SYSTEMS
// Aggressive caching for static assets

const CACHE_VERSION = 'v2026-03-19-2';
const CACHE_NAME = `vachsystems-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/css/style.css',
  '/js/script.js',
  '/favicon.svg'
];

// Cache duration by file type
const CACHE_DURATIONS = {
  images: 365 * 24 * 60 * 60 * 1000, // 1 year
  styles: 30 * 24 * 60 * 60 * 1000,  // 30 days
  scripts: 30 * 24 * 60 * 60 * 1000, // 30 days
  fonts: 365 * 24 * 60 * 60 * 1000,  // 1 year
  html: 24 * 60 * 60 * 1000          // 1 day
};

// Install event - precache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('vachsystems-') && name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Determine caching strategy based on file type
  const strategy = getCacheStrategy(url.pathname);
  
  event.respondWith(
    strategy(request)
  );
});

// Get caching strategy based on file type
function getCacheStrategy(pathname) {
  // Images: Cache first, network fallback
  if (pathname.match(/\.(webp|png|jpg|jpeg|svg|gif)$/i)) {
    return cacheFirst;
  }
  
  // CSS/JS: Stale-while-revalidate
  if (pathname.match(/\.(css|js)$/i)) {
    return staleWhileRevalidate;
  }
  
  // HTML: Network first, cache fallback
  if (pathname.match(/\.(html?)$/i) || pathname === '/' || !pathname.includes('.')) {
    return networkFirst;
  }
  
  // Fonts: Cache first
  if (pathname.match(/\.(woff2?|ttf|eot)$/i)) {
    return cacheFirst;
  }
  
  // Default: network first
  return networkFirst;
}

// Cache first strategy (best for images, fonts)
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline - asset not cached', { status: 503 });
  }
}

// Network first strategy (best for HTML)
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Offline - page not cached', { status: 503 });
  }
}

// Stale-while-revalidate strategy (best for CSS/JS)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Message handler for manual cache updates
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys()
        .then(names => Promise.all(names.map(name => caches.delete(name))))
        .then(() => event.ports[0].postMessage({ success: true }))
    );
  }
});
