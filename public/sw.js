// Bump CACHE whenever the caching strategy changes; old caches are deleted on activate.
const CACHE = 'odt-shell-v3';
const CORE = ['/', '/manifest.webmanifest', '/favicon.ico'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Pages: network first so crawlers and visitors always get the latest HTML after a deploy.
  // On failure, only return the exact cached URL — never substitute the homepage (avoids soft-404).
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful navigations for offline use of that same URL only
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(c => c.put(event.request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(cached => {
            if (cached) return cached;
            // Explicit offline response — do NOT return '/' (that looks like a soft 404 to crawlers)
            return new Response(
              '<!doctype html><html><head><meta charset="utf-8"><title>Offline</title></head><body><p>You are offline. Reconnect to load this page.</p></body></html>',
              { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          })
        )
    );
    return;
  }

  // Static assets (hashed by Vite): cache first.
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ||
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy));
        return response;
      }).catch(() => new Response('', { status: 503 }))
    )
  );
});
