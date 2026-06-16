import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5cWsxblQxCt4NhfvlguelhL1H9tGHlQc",
  authDomain: "monitoring-albay.firebaseapp.com",
  projectId: "monitoring-albay",
  storageBucket: "monitoring-albay.appspot.com",
  messagingSenderId: "690985961991",
  appId: "1:690985961991:web:106c71bd84c8bcb075f8a2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();