const CACHE_NAME = 'watch-and-chill-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Only manage same-origin app files. Cross-origin requests (video/image CDNs)
  // go straight to the network so range requests and streaming aren't disturbed.
  if (url.origin !== self.location.origin) return;

  const isNavigation = request.mode === 'navigate' || request.destination === 'document';

  if (isNavigation) {
    // Network-first for the HTML shell: a fresh deploy must be picked up right
    // away, since it references hashed JS bundle filenames that change on every
    // build — a stale cached shell would point at a bundle that no longer exists.
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for hashed static assets (JS bundles, icons, manifest) — safe to
  // cache aggressively since their filenames change whenever their content does.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        return response;
      });
    })
  );
});
