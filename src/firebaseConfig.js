// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzBasuRjVXMQW-Vqz_YCKPjhYbNNOgY3Q",
  authDomain: "presentation-1ad9a.firebaseapp.com",
  databaseURL: "https://presentation-1ad9a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "presentation-1ad9a",
  storageBucket: "presentation-1ad9a.appspot.com",
  messagingSenderId: "988678224116",
  appId: "1:988678224116:web:6ac9e90e9e76e5bcb746a1",
  measurementId: "G-HLBJYCZZ3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export default app