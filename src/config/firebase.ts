import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANduNez15O7vypsvfsVsDLdeitPMRaLoE",
  authDomain: "purpletodo-2f042.firebaseapp.com",
  projectId: "purpletodo-2f042",
  storageBucket: "purpletodo-2f042.firebasestorage.app",
  messagingSenderId: "800193023386",
  appId: "1:800193023386:web:c3ed643281a5698651be23",
  measurementId: "G-T4H3C42GDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app; 