// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDseIOaysmhMDjUeTfLGrcXZxiyfqE5gII",
  authDomain: "citypulse-104be.firebaseapp.com",
  projectId: "citypulse-104be",
  storageBucket: "citypulse-104be.firebasestorage.app",
  messagingSenderId: "456582421837",
  appId: "1:456582421837:web:cb62393d2ff51d3c5deb04",
  measurementId: "G-LPCBDW5543"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);