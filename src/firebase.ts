import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBu1mrn0mnuZosKkTdbZ26ERpYULSmttzA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "foodfreshnessmonitor.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://foodfreshnessmonitor-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "foodfreshnessmonitor",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "foodfreshnessmonitor.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "44149331734",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:44149331734:web:0bb4d470651abcb27ee237",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5RQ3S0F9H6",
};

export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let dbInstance: Database | null = null;
try {
  dbInstance = getDatabase(app);
} catch (error) {
  // Graceful fallback for SSR or environments without network
  console.warn("Firebase Realtime Database init deferred:", error);
}

export const database = dbInstance as Database;

// Analytics is optional; initialize it only when supported and in browser.
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics is optional and must not block the app.
    });
}
