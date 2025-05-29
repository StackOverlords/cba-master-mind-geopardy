import axios from "axios";
import type { UserData } from "../shared/auth.types";
import type { CreateUserDTO } from "../shared/types";

export const createUserApi = async (user: CreateUserDTO, accessToken: string): Promise<UserData> => {
    try {
        const response = await axios.post("users/create", user, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const newUserData: UserData = {
            _id: response.data._id,
            firebaseUid: response.data.firebaseUid,
            email: response.data.email,
            displayName: response.data.name,
            role: response.data.role
        };
        return newUserData;
    } catch (error) {
        throw new Error("Error creating user");
    }
};

export const validSessionApi = async (accessToken: string): Promise<UserData> => {
    try {
        const response = await axios.post("auth/validSession", { accessToken });

        const userData: UserData = {
            _id: response.data._id,
            firebaseUid: response.data.firebaseUid,
            email: response.data.email,
            displayName: response.data.name,
            role: response.data.role
        };
        return userData;
    } catch (error) {
        throw new Error("Error validating session");
    }
}
// export const syncUserWithBackend = async (credentials: LoginCredentials): Promise<UserData> => {
//   const response = await axios.post('/api/auth/google', credentials);
//   return response.data; // Retorna el usuario completo (rol, etc.)
// };
