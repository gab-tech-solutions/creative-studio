import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// ⚠️ REPLACE these values with your own from Firebase Console → Project settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BOARD_REF = doc(db, "boards", "main");
const USERS_REF = doc(db, "config", "users");
const COMPANY_REF = doc(db, "config", "company");

export { db, BOARD_REF, USERS_REF, COMPANY_REF, setDoc, onSnapshot };
