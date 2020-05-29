/// Lyssnar på event om användaren klickar på notisen
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
});

/////////   DOWNLOAD  ////////////////////
self.addEventListener("install", (event) => {
  /*   console.log(self);  */
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "index.html",
        "css/styles.css",
        "js/index.js",
        "offline.html",
      ]);
    })
  );
  self.skipWaiting();
  console.log("SW installed at: ", new Date().toLocaleTimeString());
});

////////   INSTALL  /////////////////////
self.addEventListener("activate", (event) => {
  self.skipWaiting();
  console.log("SW activated at: ", new Date().toLocaleTimeString());
});

////////   ACTIVATE  /////////////////////
self.addEventListener("fetch", (event) => {
  /*  console.log(event.request.url); */
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!navigator.onLine) {
        if (response) {
          return response;
        } else {
          return caches.match(new Request("offline.html"));
        }
      } else if (event.request.method === "GET") {
        return updateCache(event.request);
      } else {
        return fetch(event.request);
      }
    })
  );
});

//// Listen for push notification

self.addEventListener("push", (event) => {
  if (event.data) {
    createNotification(event.data.text());
  }
});

//// Create a notification with web notification API

const createNotification = (text) => {
  self.registration.showNotification("Instablam", {
    body: text,
    icon: "image/icon/apple-touch-icon.png",
  });
};

async function updateCache(request) {
  return fetch(request).then((response) => {
    if (response) {
      return caches.open("v1").then((cache) => {
        return cache.put(request, response.clone()).then(() => {
          return response;
        });
      });
    }
  });
}
