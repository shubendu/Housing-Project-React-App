// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaBCmjsfmkFl8JdVtqt_2NEyh-g_M2d3M",
  authDomain: "demohousing-e6840.firebaseapp.com",
  projectId: "demohousing-e6840",
  storageBucket: "demohousing-e6840.appspot.com",
  messagingSenderId: "588022315801",
  appId: "1:588022315801:web:6efa46c7024d2e21ada388"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db =getFirestore()