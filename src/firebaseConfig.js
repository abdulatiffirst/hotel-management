// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZQzrNBROdylTLsZXCofX4YPcu2DWkOtI",
  authDomain: "hotel-d51a5.firebaseapp.com",
  databaseURL: "https://hotel-d51a5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hotel-d51a5",
  storageBucket: "hotel-d51a5.firebasestorage.app",
  messagingSenderId: "184287285791",
  appId: "1:184287285791:web:a0f1ab689818525f0fbb2a",
  measurementId: "G-Y86VRM7H89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export default app
