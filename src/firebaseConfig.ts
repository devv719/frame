// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDuYvLMDTgaNDVVkIOaVfKZUlIA6bp_J6k",
    authDomain: "frame-5e475.firebaseapp.com",
    projectId: "frame-5e475",
    storageBucket: "frame-5e475.firebasestorage.app",
    messagingSenderId: "1058166445283",
    appId: "1:1058166445283:web:9d46eded6b64c7f3fd21d6",
    measurementId: "G-WJBC7QC3NV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics conditionally (client-side only)
export const analytics = typeof window !== "undefined"
    ? isSupported().then((supported) => supported ? getAnalytics(app) : null).catch(() => null)
    : null;
