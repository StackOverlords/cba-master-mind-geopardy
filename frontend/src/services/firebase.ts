// firebase.ts
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Añade esto
import { firebaseVariables } from "../config/env";
import type { LoginCredentials } from "../shared/types";
const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId } = firebaseVariables
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app); // Inicializa Auth
const googleProvider = new GoogleAuthProvider(); // Configura Google
// Handle sign-in with Google
const signInWithGoogle = async (): Promise<LoginCredentials | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const payload: LoginCredentials = {
      firebaseUid: result.user.uid,
      name: result.user.displayName || '',
      email: result.user.email || '',
    }
    // console.log(result);
    return payload;
  } catch (error) {
    // console.error(error);
    return null
  }
}

export { app, auth, googleProvider, signInWithGoogle }; // Exporta auth y el provider