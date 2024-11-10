import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyC-Gh-0P7sm3HQxUm21H7NKJwws8bpFapc",
  authDomain: "eco-friendly-app-745ff.firebaseapp.com",
  projectId: "eco-friendly-app-745ff",
  storageBucket: "eco-friendly-app-745ff.appspot.com", // Check this value
  messagingSenderId: "218190810607",
  appId: "1:218190810607:web:1149b666f77485d0223a1a",
  measurementId: "G-2PMX292CF0"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const db = getFirestore(app);


export { auth, app, firestore, storage, db }; // Export storage as well
