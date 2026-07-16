const CACHE_NAME = 'watch-and-chill-offline-fallback';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Wipe every cache on every activation — no cached response is ever allowed
  // to survive a new deploy or a new visit. Cache Storage below is repopulated
  // purely as an offline fallback, never trusted as a source of truth.
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
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

  // Always network-first, bypassing the browser's own HTTP cache too, so a
  // fresh deploy is picked up immediately while online. The cache is only
  // ever read from when the network request actually fails (real offline use).
  event.respondWith(
    fetch(request, { cache: 'no-store' })
      .then(response => {
        caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
