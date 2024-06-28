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