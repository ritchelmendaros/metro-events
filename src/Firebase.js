// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcwlZ2u8qG_LfifnJsHkrr-_u9g12YClc",
  authDomain: "metroevents-aa315.firebaseapp.com",
  projectId: "metroevents-aa315",
  storageBucket: "metroevents-aa315.appspot.com",
  messagingSenderId: "290719159580",
  appId: "1:290719159580:web:5cdef9f478781c61f396d9",
  measurementId: "G-ZW82L01VLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(); // Initialize the auth module

export { app, analytics, auth };// Export the Firebase app instance