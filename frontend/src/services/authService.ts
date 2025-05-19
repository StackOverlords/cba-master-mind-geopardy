import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../stores/authStore";
import { auth } from "../lib/firebase";
import type { LoginCredentials } from "../shared/types";

export const checkAuthOnStart = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            const user: LoginCredentials = {
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
            };
            useAuthStore.getState().setUser(user);
        } else {
            useAuthStore.getState().logout();
        }
    });
};
