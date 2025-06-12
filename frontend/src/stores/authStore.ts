import { create } from "zustand";
import type { AuthState, LoginCredentials, RegisterCredentials, UserRole } from "../shared/auth.types";
import { auth } from "../lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserData, login, logout, register, removeUser, signInWithGoogle, updateUser } from "../lib/firebase/firebaseAuth";
import { removeLoginFlag, setLoginFlag } from "../utils/localStorage";
import type { CreateUserDTO } from "../shared/types";

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: false,
    isLoadingButtons: {
        withGoogle: false,
        withEmail: false,
        login: false,
        register: false,
        loaderPage: false
    },
    error: null,
    isAuthenticated: false,

    login: async (credentials: LoginCredentials) => {
        set({ isLoadingButtons: { withGoogle: false, withEmail: false, login: true, loaderPage: false }, error: null });
        try {
            const userData = await login(credentials);
            setLoginFlag();
            set({ user: userData, isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false }, isAuthenticated: true });
        } catch (error) {
            set({ error: "Error al iniciar sesión", isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false } });
            throw error;
        }
    },

    loginWithGoogle: async () => {
        set({ isLoadingButtons: { withGoogle: true, withEmail: false, login: false, loaderPage: false }, error: null });
        try {
            const userData = await signInWithGoogle();
            setLoginFlag();
            set({ user: userData, isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false }, isAuthenticated: true });
        } catch (error) {
            set({ error: "Error con inicio de sesión Google", isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false } });
            throw error;
        }
    },

    register: async (data: RegisterCredentials) => {
        set({ isLoadingButtons: { withGoogle: false, withEmail: true, login: false, loaderPage: false }, error: null });
        try {
            const userData = await register(data);
            setLoginFlag();
            set({ user: userData, isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false }, isAuthenticated: true });
        } catch (error) {
            set({ error: "Error al registrar usuario", isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false } });
            throw error;
        }
    },
    update: async (updates: CreateUserDTO) => {
        const current = auth.currentUser;
        if (!current) return;
        const userData = await updateUser(updates, current);
        set({ user: userData });
    },

    delete: async () => {
        const current = auth.currentUser;
        if (!current) return;
        await removeUser(current);
        set({ user: null, isAuthenticated: false });
    },

    logout: async () => {
        try {
            removeLoginFlag();
            await logout();
            set({ user: null, isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false }, isAuthenticated: false, error: null });
        } catch (error) {
            set({ error: "Error al cerrar sesión", isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false } });
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
        set({ isLoading: true })
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await getUserData(firebaseUser);
                    set({ user: userData, isLoading: false, isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false }, isAuthenticated: true });
                } catch (error) {
                    set({ user: null, isLoading: false, isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false }, error: 'Error al cargar datos de usuario', isAuthenticated: false });
                }
            } else {
                removeLoginFlag();
                set({ user: null, isLoading: false, isLoadingButtons: { withGoogle: false, withEmail: false, login: false, loaderPage: false }, isAuthenticated: false });
            }
        });

        // Retornar función de limpieza
        return unsubscribe;
    }
}));

export const unsubscribeAuth = useAuthStore.getState().initialize();