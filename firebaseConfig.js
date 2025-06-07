import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// For web
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Auth with platform-specific persistence
const auth = Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });

const db = getFirestore(app);

export { auth, db };


