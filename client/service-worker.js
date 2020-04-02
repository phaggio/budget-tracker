const FILES_TO_CACHE = [
  `/`,
  `/index.html`,
  `/dist/index.bundle.js`,
  `/dist/manifest.json`,
  `/dist/assets/icons/icon_96x96.png`,
  `/dist/assets/icons/icon_128x128.png`,
  `/dist/assets/icons/icon_256x256.png`,
  `/dist/assets/icons/icon_512x512.png`
];

const CACHE_NAME = `static-cache-v1`;
const DATA_CACHE_NAME = `data-cache-v1`;

// install
self.addEventListener(`install`, event => {
  console.log(`begin install`);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log(`Your files were pre-cached successfully!`);
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// activate
self.addEventListener(`activate`, event => {
  console.log(`begin activate`);
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log(`Removing older version of cache data: ${key}`);
          return caches.delete(key);
        }
        return undefined;
      })
    ))
  );

  self.clients.claim();
});

// fetch
self.addEventListener(`fetch`, event => {
  console.log(`begin fetch`);
  // cache successful requests to the API
  if (event.request.url.includes(`/`)) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME)
        .then(cache => fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            console.log(`network request failed`)
            cache.match(event.request);
            console.error(err);
          })
        )
        .catch(err => console.error(err))
    );
  } else {
    // if the request is not for the API, serve static assets using "offline-first" approach.
    // https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
        .catch(err => console.error(err))
    );
  }
});
