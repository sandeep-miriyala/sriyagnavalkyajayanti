// Change this version whenever the site is updated.
const CACHE_NAME = 'yagnavalkya-v12-2026';

// Small core files needed to open the app offline.
// (Big video/audio/PDF files are cached only after someone opens them.)
const CORE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css',
  '/fonts/telugu-fonts.css',
  '/app.js',
  '/paintings.js',
  '/vendor/jszip.min.js',
  '/pwa.js',
  '/vendor/fuse.basic.min.js',
  '/vendor/html2canvas.min.js',
  '/vendor/fa/css/all.min.css',
  '/vendor/fa/webfonts/fa-solid-900.woff2',
  '/vendor/fa/webfonts/fa-regular-400.woff2',
  '/vendor/fa/webfonts/fa-brands-400.woff2',
  '/quiz.js',
  '/gotra.js',
  '/192.png',
  '/512.png',
  '/32px-Om_symbol.svg.png',
  '/Image 1.jpg',
  '/Image 9.jpg',
  '/fonts/noto-sans-telugu-telugu-400-normal.woff2',
  '/fonts/noto-sans-telugu-telugu-700-normal.woff2',
  '/fonts/noto-sans-telugu-latin-400-normal.woff2',
  '/fonts/noto-sans-telugu-latin-700-normal.woff2',
  '/fonts/noto-serif-telugu-telugu-400-normal.woff2',
  '/fonts/noto-serif-telugu-telugu-700-normal.woff2',
  '/fonts/noto-serif-telugu-latin-400-normal.woff2',
  '/fonts/noto-serif-telugu-latin-700-normal.woff2',
  '/fonts/material-icons.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // Add one by one, so a single missing file never breaks installation.
      .then((cache) => Promise.allSettled(CORE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  // Let the browser stream audio/video directly (range requests can't be cached safely).
  if (req.headers.has('range')) return;

  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isPage) {
    // Pages: always try the network first so new invitation details show immediately.
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put('/index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  // Other files: network first (so new pictures/files show at once), saved copy only when offline.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
