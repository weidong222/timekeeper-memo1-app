// Service Worker for 时光备忘录
const CACHE_NAME = 'timekeeper-memo-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './cordova-app.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 安装Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果缓存中有，直接返回
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// 更新Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 处理通知点击
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// 处理后台同步
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 执行后台任务
      console.log('Background sync triggered')
    );
  }
});
