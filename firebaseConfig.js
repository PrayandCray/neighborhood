// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBB-iMgmr-MH9VY_yeajGJJYUe5UyGxZOE",
    authDomain: "pantry-manager-app-b595d.firebaseapp.com",
    projectId: "pantry-manager-app-b595d",
    storageBucket: "pantry-manager-app-b595d.appspot.com", // fixed typo here
    messagingSenderId: "567093583241",
    appId: "1:567093583241:web:243aec2ef4a648a6009558"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);