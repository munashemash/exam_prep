import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured =
  Object.values(firebaseConfig).every(Boolean);

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let servicesPromise: Promise<FirebaseServices | null> | null = null;

export function getFirebaseServices(): Promise<FirebaseServices | null> {
  if (!isFirebaseConfigured || typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (servicesPromise) return servicesPromise;

  servicesPromise = Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
    import("firebase/firestore"),
  ]).then(([appApi, authApi, firestoreApi]) => {
    const app = appApi.getApps()[0] ?? appApi.initializeApp(firebaseConfig);
    const auth = authApi.getAuth(app);
    let db: Firestore;
    try {
      db = firestoreApi.initializeFirestore(app, {
        localCache: firestoreApi.persistentLocalCache({
          tabManager: firestoreApi.persistentMultipleTabManager(),
        }),
      });
    } catch {
      db = firestoreApi.getFirestore(app);
    }
    return { app, auth, db };
  });

  return servicesPromise;
}
