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

// İkinci bir Firebase app örneği: yönetici panelinden yeni katılımcı hesabı
// oluştururken kullanılır. createUserWithEmailAndPassword normalde çağıran
// oturumu yeni kullanıcıya çevirir; ayrı bir app örneğinde çalıştırıp hemen
// oradan çıkış yaparak yöneticinin kendi oturumunun bozulmaması sağlanır.
const adminCreationApp = initializeApp(firebaseConfig, "adminCreationApp");
export const authForAdminCreation = getAuth(adminCreationApp);
// Yeni katılımcının kendi belgesini kendi kimliğiyle (admin'in değil) yazabilmesi için
// bu app örneğine bağlı ayrı bir Firestore bağlantısı.
export const dbForAdminCreation = getFirestore(adminCreationApp);