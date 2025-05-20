import { create } from "zustand";
import type { AuthContextType, LoginCredentials, RegisterCredentials, UserData, UserRole } from "../shared/auth.types";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from "firebase/auth";
// import type { LoginCredentials } from "../shared/types";

// interface AuthState {
//     user: LoginCredentials | null;
//     setUser: (user: LoginCredentials) => void;
//     logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//     user: null,
//     setUser: (user) => set({ user }),
//     logout: () => set({ user: null }),
// }));


const createUserData = async (firebaseUser: FirebaseUser): Promise<UserData> => {
    // const userRef = doc(db, 'users', firebaseUser.uid);
    // const userDoc = await getDoc(userRef);

    // if (userDoc.exists()) {
    //     return userDoc.data() as UserData;
    // } else {
    //     // Usuario nuevo: crear un perfil básico con rol de usuario
    //     const newUserData: UserData = {
    //         uid: firebaseUser.uid,
    //         email: firebaseUser.email,
    //         displayName: firebaseUser.displayName,
    //         role: 'user'
    //     };

    //     // Guardar en Firestore
    //     await setDoc(userRef, newUserData);
    //     return newUserData;
    // }
    const newUserData: UserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: 'user'
    };
    return newUserData;
};

export const useAuthStore = create<AuthContextType>((set, get) => ({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,

    login: async ({ email, password }: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const userData = await createUserData(result.user);
            set({ user: userData, isLoading: false });
        } catch (error) {
            set({ error: 'Error al iniciar sesión', isLoading: false });
            throw error;
        }
    },

    register: async ({ email, password, displayName }: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Crear el perfil de usuario con rol básico
            const userData: UserData = {
                uid: result.user.uid,
                email: result.user.email,
                displayName,
                role: 'user'
            };

            // Guardar en Firestore
            // await setDoc(doc(db, 'users', result.user.uid), userData);
            set({ user: userData, isLoading: false });
        } catch (error) {
            set({ error: 'Error al registrar usuario', isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            set({ error: 'Error al cerrar sesión' });
            throw error;
        }
    },

    hasRole: (role: UserRole) => {
        const { user } = get();
        // return !!user?.roles.includes(role);
        return user?.role === role;
    },

    initialize: () => {
        // Escuchar cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await createUserData(firebaseUser);
                    set({ user: userData, isLoading: false });
                } catch (error) {
                    set({ user: null, isLoading: false, error: 'Error al cargar datos de usuario' });
                }
            } else {
                set({ user: null, isLoading: false });
            }
        });

        // Retornar función de limpieza
        return unsubscribe;
    }
}));

export const unsubscribeAuth = useAuthStore.getState().initialize();