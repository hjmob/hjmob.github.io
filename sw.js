var cacheName = 'latestNews-v1';

// 安装
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)

    //外壳
    .then(cache => cache.addAll([
      './main.js',
      './huoying.jpg',
      './style.css',
      './index.html'
    ]))
  );
});

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
