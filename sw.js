// KLMX Order Form - Service Worker
const CACHE = 'klmx-order-v2';
const URLS = [
    'https://jojoklmx.github.io/klmx-web/order.html',
    'https://jojoklmx.github.io/klmx-web/manifest.json',
    'https://jojoklmx.github.io/klmx-web/icon-192.png',
    'https://jojoklmx.github.io/klmx-web/icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(URLS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            return cached || fetch(e.request).then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE).then(cache => cache.put(e.request, clone));
                }
                return response;
            }).catch(() => cached);
        })
    );
});
