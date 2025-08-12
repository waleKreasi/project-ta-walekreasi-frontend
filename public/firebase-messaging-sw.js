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

// Handle notifikasi saat aplikasi di background
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] 📩 Background message received:', payload);

  const notificationTitle = payload.notification?.title || "Notifikasi Baru";
  const rawData = payload.data || {};

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: '/icons/icon-192x192.png',
    data: {
      orderId: String(rawData.orderId || ""),
      type: String(rawData.type || ""),
    },
  };

  console.log('Menampilkan notifikasi dengan opsi:', notificationOptions);
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle klik pada notifikasi
self.addEventListener('notificationclick', function (event) {
  const data = event.notification.data || {};
  console.log('🔔 Notifikasi diklik:', data);

  event.notification.close();

  let urlToOpen = '/'; // default halaman utama

  if (data.type === 'customer') {
    urlToOpen = '/shop/account';
  } else if (data.type === 'seller') {
    urlToOpen = '/store/orders';
  } else if (data.type === 'welcome') {
    urlToOpen = '/shop/home'; // halaman sambutan customer baru
  }

  console.log('Membuka URL:', urlToOpen);

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
});
