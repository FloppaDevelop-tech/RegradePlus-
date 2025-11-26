// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsVopI5-6yaYBX78_jpXKujV9xHIzYFYM",
    authDomain: "regradeplus-b0390.firebaseapp.com",
    projectId: "regradeplus-b0390",
    storageBucket: "regradeplus-b0390.firebasestorage.app",
    messagingSenderId: "398294611314",
    appId: "1:398294611314:web:2478255b5063900bdc19eb",
    measurementId: "G-VMQM7QQ0K4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services for use in other files
export { app, analytics, db, auth, storage };
