let authToken = ''; // Recieve from Component
let urlPattern = new RegExp('(http|https)://(\\S+)/(\\S+)/(audio)/(\\S+)');

self.addEventListener('install', event => {
  const params = new URL(location);
  authToken = params.searchParams.get('token');
  const installCompleted = Promise.resolve()
    .then(() => {
    });
  event.waitUntil(installCompleted);
});

self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim(),
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    }));
});

// This function is implement from the guide of @Ashesh3
self.addEventListener('fetch', event => {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }
  if (urlPattern.test(event.request.url)) {
    event.respondWith(customHeaderRequestFetch(event));
  }
});

function customHeaderRequestFetch(event) {
  const newRequest = new Request(event.request, {
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    headers: {
      range:
        event.request.headers.get("range") != null ? event.request.headers.get("range") : "0-",
      Authorization: authToken,
      Accept: 'audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5',
    }
  });
  console.log("Service Worker added more headers");
  return fetch(newRequest);
}
