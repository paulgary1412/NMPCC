// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEqa8xOrWXqt9I68WdC4uE3W1vnA8jvW0",
  authDomain: "dengapp-5d20c.firebaseapp.com",
  projectId: "dengapp-5d20c",
  storageBucket: "dengapp-5d20c.appspot.com",
  messagingSenderId: "603039875561",
  appId: "1:603039875561:web:2b1c540cb1b1d067434b78",
  measurementId: "G-3DGJE66QX4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };