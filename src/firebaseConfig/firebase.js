// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyB1mx4j6qyrXMRfuXfkJLdK3SV8pwa6rMQ",

  authDomain: "pctmitre.firebaseapp.com",

  projectId: "pctmitre",

  storageBucket: "pctmitre.appspot.com",

  messagingSenderId: "187883649657",

  appId: "1:187883649657:web:e6b4bfc67c69c370f2b2a8"

/*
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID*/
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);