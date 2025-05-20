export interface CommonProps {
    key?: string | number;
    className?: string;
}

export interface CreateUserDTO {
    firebaseUid: string;
    name: string | null;
    email: string | null;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
