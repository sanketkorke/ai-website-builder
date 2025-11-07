import { initializeApp } from "firebase/app";
// ** Make sure getAuth is imported **
import { getAuth } from "firebase/auth";
// You can keep getAnalytics if you plan to use it later
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (using the keys you provided)
const firebaseConfig = {
  apiKey: "AIzaSyAUd_2oQWPKQjtlVKB3oECtlXY7lJjfqGc",
  authDomain: "ai-website-5eeaf.firebaseapp.com",
  projectId: "ai-website-5eeaf",
  storageBucket: "ai-website-5eeaf.appspot.com", // Corrected storage bucket domain
  messagingSenderId: "1054137840165",
  appId: "1:1054137840165:web:99b47c55e92cb52d3505cc",
  measurementId: "G-BGM60R7T55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ** Initialize Firebase Authentication correctly **
const auth = getAuth(app);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// ** Ensure auth and app are exported **
export { auth, app };