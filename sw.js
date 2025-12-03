const CACHE = 'zwanski-static-v1';
const toCache = [
  '/',
  '/index.html',
  '/placeholder.png',
  '/styles.css'
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(toCache)).catch(()=>{}))
})

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})
