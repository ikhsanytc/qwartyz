self.addEventListener("push", function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    data: {
      sender: data.sender,
    },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/chat/" + event.notification.data.sender)
  );
});
