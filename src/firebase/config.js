import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAe4Wt8RR8FmmsiOFKBW--k6bF02auCqlA",
    authDomain: "delivery-9307e.firebaseapp.com",
    projectId: "delivery-9307e",
    storageBucket: "delivery-9307e.appspot.com",
    messagingSenderId: "942945814636",
    appId: "1:942945814636:web:5543e645a232b4f1da7049",
    measurementId: "G-EE5K3WR8W3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);