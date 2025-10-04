// Install Firebase JS SDK
// See https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxRWWdcfdt-WD80krY_vEmjnUMHRQCbjc",
  authDomain: "expense-manager-hackathon.firebaseapp.com",
  projectId: "expense-manager-hackathon",
  storageBucket: "expense-manager-hackathon.firebasestorage.app",
  messagingSenderId: "729396156325",
  appId: "1:729396156325:web:ce7378bf7df15844207a4c",
  measurementId: "G-L5EY8V1L53",
};
// Initialize Firebase
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
