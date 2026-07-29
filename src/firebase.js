import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcqHtOrLZUa5NLy5bDLRZuL9XcBBNU_r4",
  authDomain: "neofizik-90d1b.firebaseapp.com",
  projectId: "neofizik-90d1b",
  storageBucket: "neofizik-90d1b.firebasestorage.app",
  messagingSenderId: "1099126229023",
  appId: "1:1099126229023:web:043d5f92128715e7982d2a",
  measurementId: "G-Z3M19T8LKH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); // Veritabanı işlemleri için
export const auth = getAuth(app);     // Giriş işlemleri için