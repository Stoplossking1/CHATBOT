// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDz65-F0EbmZplQ2kbIewXxzkWIy5Qut5U",
  authDomain: "tp1web-8cb6b.firebaseapp.com",
  projectId: "tp1web-8cb6b",
  storageBucket: "tp1web-8cb6b.appspot.com",
  messagingSenderId: "1051443096756",
  appId: "1:1051443096756:web:7d1e494952225f0ed43be1",
  measurementId: "G-D1EV07JTFY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, storage, auth, googleProvider };
