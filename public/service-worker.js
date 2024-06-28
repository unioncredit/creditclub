/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // Precache manifest generated by the Workbox CLI
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Example of caching API responses
  workbox.routing.registerRoute(
    new RegExp('https://jsonplaceholder.typicode.com/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
    })
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

self.addEventListener('push', event => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://beta.creditclub.cc/glasses.png',
      badge: 'https://beta.creditclub.cc/glasses.png'
    })
  );
});