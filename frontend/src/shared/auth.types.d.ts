export type UserRole = 'admin' | 'user' | 'guest';

export interface UserData {
    firebaseUid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    role: UserRole;
    accessToken?: string;
    _id?: string; // ID del usuario en la base de datos
    completedRegister:boolean; // Indica si el usuario ha completado el registro
    // emailVerified: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}

export interface AuthState {
    user: UserData | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    // Helpers
    hasRole: (role: UserRole) => boolean;

    // Inicialización y cleanup
    initialize: () => () => void;
    // resetPassword: (email: string) => Promise<void>;
    // updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}