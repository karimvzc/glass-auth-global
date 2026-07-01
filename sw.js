// ====================================================================
//  SERVICE WORKER
//  Версия: 1.0.0
// ====================================================================

const CACHE_NAME = 'glass-auth-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/profile.html',
  '/dashboard.html',
  '/forgot-password.html',
  '/reset-password.html',
  '/lang.js',
  '/123.jpg',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js'
];

// ====================================================================
//  УСТАНОВКА
// ====================================================================
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching files...');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('[SW] Cache error:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// ====================================================================
//  АКТИВАЦИЯ
// ====================================================================
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// ====================================================================
//  ПЕРЕХВАТ ЗАПРОСОВ
// ====================================================================
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          if (event.request.url.indexOf('.html') > -1) {
            return caches.match('/offline.html');
          }
        });
      })
  );
});