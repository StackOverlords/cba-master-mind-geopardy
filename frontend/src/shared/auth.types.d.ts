export type UserRole = 'admin' | 'user' | 'guest';

export interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    role: UserRole;
    // emailVerified: boolean;
}

export interface AuthState {
    user: UserData | null;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    displayName: string;
}

export interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    // Helpers
    hasRole: (role: UserRole) => boolean;

    // Inicialización y cleanup
    initialize: () => () => void;
    // resetPassword: (email: string) => Promise<void>;
    // updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}