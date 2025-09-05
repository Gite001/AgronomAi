// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration is now read from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// This flag checks if the necessary Firebase config values are present.
export const firebaseInitialized = 
    firebaseConfig.apiKey && 
    firebaseConfig.projectId;

// Initialize Firebase using a singleton pattern
let app: FirebaseApp;
if (firebaseInitialized) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} else {
    // Create a dummy app object if not initialized
    app = {} as FirebaseApp;
}


const auth: Auth = firebaseInitialized ? getAuth(app) : {} as Auth;
const db: Firestore = firebaseInitialized ? getFirestore(app) : {} as Firestore;
const analytics: Promise<Analytics | null> = firebaseInitialized && typeof window !== 'undefined'
    ? isSupported().then(yes => (yes ? getAnalytics(app) : null))
    : Promise.resolve(null);


export { app, auth, db, analytics };
