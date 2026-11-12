import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey:            "AIzaSyB2A6v3vOHV5atwzxmcKlvuij8CGaQrt_I",
  authDomain:        "velox-249aa.firebaseapp.com",
  projectId:         "velox-249aa",
  storageBucket:     "velox-249aa.firebasestorage.app",
  messagingSenderId: "968125678993",
  appId:             "1:968125678993:web:947e82db85bb0134a20630",
  measurementId:     "G-4XVNLG62ZE",
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const FIREBASE_CONFIGURED = true;

export { signInWithPopup, signOut };
export default app;