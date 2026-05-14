import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDz6B2De-7CiQWQyPMyC4_niW6Wm1qc-XA",
  authDomain: "meusistemacadastro-d7d10.firebaseapp.com",
  databaseURL: "https://meusistemacadastro-d7d10-default-rtdb.firebaseio.com",
  projectId: "meusistemacadastro-d7d10",
  storageBucket: "meusistemacadastro-d7d10.firebasestorage.app",
  messagingSenderId: "1034148971946",
  appId: "1:1034148971946:web:01dd348cfac2bcc9a4d7d3",
  measurementId: "G-F8SFYDZWQB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
