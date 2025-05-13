import { create } from "zustand";
import type { LoginCredentials } from "../shared/types";

interface AuthState {
    user: LoginCredentials | null;
    setUser: (user: LoginCredentials) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
