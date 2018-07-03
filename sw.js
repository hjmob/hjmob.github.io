var cacheName = 'v1';

// 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => event.waitUntil(
    Promise.all([
        // 更新客户端
        clients.claim(),
        // 清理旧版本
        caches.keys().then(cacheList => Promise.all(
            cacheList.map(cName => {
                if (cName !== cacheName) {
                    caches.delete(cacheName);
                }
            })
        ))
    ])
));

// 动态请求
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
    .then(function(response) {
      if (response) {
        return response;
      }
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if(!response || response.status !== 200) {
            return response;
          }

          var responseToCache = response.clone();
          caches.open(cacheName)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        }
      );
    })
  );
});
