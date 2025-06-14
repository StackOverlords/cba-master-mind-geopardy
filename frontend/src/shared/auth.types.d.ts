export type UserRole = 'admin' | 'player' | 'guest';

export interface UserData {
    _id: string;
    firebaseUid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    role: UserRole;
    accessToken?: string;
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
    isLoadingButtons: {withGoogle: boolean; withEmail: boolean; login: boolean; loaderPage: boolean;};
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