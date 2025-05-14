export interface CommonProps {
    key?: string | number;
    className?: string;
}
export interface LoginCredentials {
    firebaseUid: string;
    email: string;
    name?: string;
    password?: string;
}
export interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
