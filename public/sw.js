// ====================================================================
// Mineradio Service Worker — 离线缓存 (N8)
// 策略：
//   - 静态资源（vendor/ assets/ .js .css .png .jpg .svg .woff2）→ 缓存优先
//   - index.html → 网络优先，失败回退缓存
//   - /api/* → 不缓存，始终走网络
// ====================================================================

const SW_CACHE = 'mineradio-v1.1.3-landing';
const PRECACHE_URLS = [
  '/',
  '/landing.html',
  '/app',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/vendor/three.r128.min.js',
];

// 安装：预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SW_CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== SW_CACHE).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 只处理同源 GET 请求
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // API 请求不缓存
  if (url.pathname.startsWith('/api/')) return;

  // 静态资源（vendor/ assets/ 带扩展名的文件）→ 缓存优先
  const isStaticAsset = url.pathname.startsWith('/vendor/') ||
    url.pathname.startsWith('/assets/') ||
    /\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|wasm)$/.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // 后台更新缓存
          fetch(req).then((res) => {
            if (res && res.status === 200) {
              caches.open(SW_CACHE).then((cache) => cache.put(req, res.clone()));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(SW_CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // HTML 页面 → 网络优先，失败回退缓存
  if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(SW_CACHE).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }
});
