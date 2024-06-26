// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWMOeV4zQbcHcVdYxIl62WMXIYeLakZZA",
  authDomain: "animals-manager-9dde4.firebaseapp.com",
  projectId: "animals-manager-9dde4",
  storageBucket: "animals-manager-9dde4.appspot.com",
  messagingSenderId: "592031019482",
  appId: "1:592031019482:web:8dde402d7a67f6775090e3",
  measurementId: "G-13KBVXYN8F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);

if (import.meta.env.MODE === "development") {
  // 開発環境ではFirestore emulatorを使用する
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}
