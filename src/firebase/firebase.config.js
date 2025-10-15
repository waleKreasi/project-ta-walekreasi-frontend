// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlFbYAlvMT2NBwY230lEckzArq70SuPJo",
  authDomain: "marketplace-walekreasi-pwa.firebaseapp.com",
  projectId: "marketplace-walekreasi-pwa",
  storageBucket: "marketplace-walekreasi-pwa.appspot.com",
  messagingSenderId: "383065971850",
  appId: "1:383065971850:web:44ad6ea6ea376be266a173",
  measurementId: "G-B65GWXF3DR"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Dapatkan instance messaging
const messaging = getMessaging(app);

// Minta token FCM dari user
const requestForToken = async (userId) => {
  if (!userId) {
    console.warn("⚠️ userId tidak tersedia, token tidak disimpan.");
    return;
  }

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BF1azTsD0hTD93ilVDdP7sqhDFgKIwY1E3l2AhyH6Vn-RxSGquZ71kHAMGTyRxLHoV3hOZI6Ylh6Xyij_nI04pQ",
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);

      try {
        const res = await fetch("https://walekreasi-backend-thrid.onrender.com/api/notification/save-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token: currentToken,
          }),
          
        });

        if (!res.ok) {
          throw new Error(`Gagal menyimpan token: ${res.status}`);
        }

        console.log("✅ Token FCM berhasil disimpan ke backend.");
      } catch (error) {
        console.error("❌ Error menyimpan token:", error);
      }
    } else {
      console.warn("⚠️ Tidak ada token tersedia. Izin belum diberikan.");
    }
  } catch (err) {
    console.error("❌ Gagal mendapatkan token FCM:", err);
  }
};

// Listener notifikasi saat app di foreground
const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Notifikasi diterima (foreground):", {
        title: payload?.notification?.title,
        body: payload?.notification?.body,
        data: payload?.data,
      });
      resolve(payload);
    });
  });

export { messaging, requestForToken, onMessageListener };
