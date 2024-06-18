// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   /*apiKey: "AIzaSyB1mx4j6qyrXMRfuXfkJLdK3SV8pwa6rMQ",

  authDomain: "pctmitre.firebaseapp.com",

  projectId: "pctmitre",

  storageBucket: "pctmitre.appspot.com",

  messagingSenderId: "187883649657",

  appId: "1:187883649657:web:e6b4bfc67c69c370f2b2a8"*/


  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);