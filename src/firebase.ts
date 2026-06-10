// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrQsupILMX1g7f7fHi3y-7OKs9mPLffOc",
  authDomain: "beautybag-6d6b9.firebaseapp.com",
  projectId: "beautybag-6d6b9",
  storageBucket: "beautybag-6d6b9.firebasestorage.app",
  messagingSenderId: "934089289633",
  appId: "1:934089289633:web:a7a5053c97294ba7f225e0",
  measurementId: "G-7HB2SVVX0S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
