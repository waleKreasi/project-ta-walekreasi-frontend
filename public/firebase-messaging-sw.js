importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Inisialisasi Firebase App di Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDlFbYAlvMT2NBwY230lEckzArq70SuPJo",
  authDomain: "marketplace-walekreasi-pwa.firebaseapp.com",
  projectId: "marketplace-walekreasi-pwa",
  storageBucket: "marketplace-walekreasi-pwa.appspot.com",
  messagingSenderId: "383065971850",
  appId: "1:383065971850:web:44ad6ea6ea376be266a173",
  measurementId: "G-B65GWXF3DR"
});

// Inisialisasi messaging
const messaging = firebase.messaging();

// Handle notifikasi saat di background
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png', // pastikan path icon valid
    data: payload.data, // agar bisa di-handle saat di-click
  };

  // Tampilkan notifikasi
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// (Opsional) Handle click pada notifikasi
self.addEventListener('notificationclick', function (event) {
  const data = event.notification.data;
  event.notification.close();

  if (data && data.orderId) {
    const urlToOpen = `/order/${data.orderId}`;
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
