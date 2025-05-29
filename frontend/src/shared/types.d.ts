export type IconType = ComponentType<SVGProps<SVGSVGElement>>;
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

export interface Answer {
    id: string
    text: string
    isCorrect: boolean
}

export interface Question {
    id: string
    text: string
    answers: Answer[]
}

export interface DialogOptions {
    isOpenDialog: boolean;
    mode: 'create' | 'update' | null;
}