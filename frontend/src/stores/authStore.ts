import { create } from "zustand";
import type { AuthState, LoginCredentials, RegisterCredentials, UserRole } from "../shared/auth.types";
import { auth } from "../lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserData, login, logout, register, removeUser, signInWithGoogle, updateUser } from "../lib/firebase/firebaseAuth";
import { removeLoginFlag, setLoginFlag } from "../utils/localStorage";
import type { CreateUserDTO } from "../shared/types";

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,

    login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
            const userData = await login(credentials);
            setLoginFlag();
            set({ user: userData, isLoading: false, isAuthenticated: true });
        } catch (error) {
            set({ error: "Error al iniciar sesión", isLoading: false });
            throw error;
        }
    },

    loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            const userData = await signInWithGoogle();
            setLoginFlag();
            set({ user: userData, isLoading: false, isAuthenticated: true });
        } catch (error) {
            set({ error: "Error con inicio de sesión Google", isLoading: false });
            throw error;
        }
    },

    register: async (data: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
            const userData = await register(data);
            setLoginFlag();
            set({ user: userData, isLoading: false, isAuthenticated: true });
        } catch (error) {
            set({ error: "Error al registrar usuario", isLoading: false });
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
            set({ user: null, isLoading: false, isAuthenticated: false, error: null });
        } catch (error) {
            set({ error: "Error al cerrar sesión" });
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
                    const userData = await getUserData(firebaseUser);
                    set({ user: userData, isLoading: false, isAuthenticated: true });
                } catch (error) {
                    set({ user: null, isLoading: false, error: 'Error al cargar datos de usuario', isAuthenticated: false });
                }
            } else {
                removeLoginFlag();
                set({ user: null, isLoading: false, isAuthenticated: false });
            }
        });

        // Retornar función de limpieza
        return unsubscribe;
    }
}));

export const unsubscribeAuth = useAuthStore.getState().initialize();