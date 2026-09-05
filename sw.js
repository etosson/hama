/* Hama service worker — makes the site installable on desktop and mobile
   and keeps the shell available offline. Bump CACHE on every release. */

const CACHE = 'hama-v1';

const SHELL = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './site.webmanifest',
    './assets/logo-light.png',
    './assets/logo-dark.png',
    './assets/logo-mark-light.png',
    './assets/kadad-express-logo.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            // Never let one missing file abort the whole install.
            .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }

    // Navigations: network first so content stays fresh, cache as the offline fallback.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((hit) => hit || caches.match('./index.html')))
        );
        return;
    }

    // Static assets: cache first, refresh in the background.
    event.respondWith(
        caches.match(request).then((hit) => {
            const network = fetch(request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const copy = response.clone();
                        caches.open(CACHE).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => hit);
            return hit || network;
        })
    );
});
