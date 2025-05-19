// firebase.ts
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth"; // Añade esto
import { firebaseVariables } from "../config/env";
import type { LoginCredentials, SignUpCredentials } from "../shared/types";
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
const signInWithGoogle = async (): Promise<LoginCredentials> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const payload: LoginCredentials = {
      firebaseUid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
    }
    console.log(result);
    return payload;
  } catch (error) {
    // console.error(error);
    throw new Error('Error signing in with Google');
  }
}

const signIn_EmailAndPassword = async (email: string, password: string): Promise<LoginCredentials> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const payload: LoginCredentials = {
      firebaseUid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
    }
    return payload;
  } catch (error) {
    throw new Error('Invalid email or password');
  }
}

const signUpWithEmailAndPassword = async ({ email, name, password }: SignUpCredentials): Promise<LoginCredentials> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await updateProfile(user,{
      displayName: name
    })
    const payload: LoginCredentials = {
      firebaseUid: user.uid,
      name: name,
      email: user.email || '',
    }
    return payload;
  } catch (error) {
    throw new Error('Registration failed');
  }
}

export {
  app,
  auth,
  googleProvider,
  signInWithGoogle,
  signIn_EmailAndPassword,
  signUpWithEmailAndPassword
}; // Exporta auth y el provider