import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBfIRC0aoi8oM-0308BVDIwDJ4uG9r6Q-g",
  authDomain: "taxgo-864dc.firebaseapp.com",
  projectId: "taxgo-864dc",
  storageBucket: "taxgo-864dc.appspot.com",
  messagingSenderId: "721954496739",
  appId: "1:721954496739:web:80de40cd26664594a2a5d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Auth = getAuth(app);

const GoogleProvider = new GoogleAuthProvider();
export { Auth, GoogleProvider, app };
