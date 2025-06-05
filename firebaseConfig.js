// Core Firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getIdToken, doc, updateDoc, setDoc, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXwVaGeaL1656E9A30UV9XR2zk3SJwDZ4",
  authDomain: "task-manager-4f8be.firebaseapp.com",
  projectId: "task-manager-4f8be",
  storageBucket: "task-manager-4f8be.firebasestorage.app",
  messagingSenderId: "299806984749",
  appId: "1:299806984749:web:98f92c253605d5107246a4",
  measurementId: "G-H7WWKPFLF7"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth =  getAuth(app);
function getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // stop listening after we get the user
        resolve(user);
      }, reject);
    });
};
const user = await getCurrentUser();
const uid = await getCurrentUser().uid;
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { app, auth, provider, storage, db, user};