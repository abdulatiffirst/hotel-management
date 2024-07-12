// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3xoYRdo6CKXmqtEVaIpMSj-1nBrrDGCQ",
    authDomain: "mohir-hotel-5d7f2.firebaseapp.com",
  databaseURL:"https://mohir-hotel-5d7f2-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "mohir-hotel-5d7f2",
  storageBucket: "mohir-hotel-5d7f2.appspot.com",
  messagingSenderId: "183068193060",
  appId: "1:183068193060:web:1991b22e8a62c22ead43b1",
  measurementId: "G-XFQN9973P8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export default app