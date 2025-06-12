import axios from "axios";
import type { UserData } from "../shared/auth.types";
import type { CreateUserDTO } from "../shared/types";
import { masterMindApi } from "./axios";
import { userEndpoints } from "./endpoints";

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
            role: response.data.role,
            completedRegister: response.data.completedRegister,
        };
        return newUserData;
    } catch (error) {
        throw new Error("Error creating user");
    }
};

export const validSessionApi = async (accessToken: string): Promise<UserData> => {
    try {
        // console.log(accessToken)
        const response = await axios.post("auth/validSession", { accessToken });
        const userData: UserData = {
            _id: response.data._id,
            firebaseUid: response.data.firebaseUid,
            email: response.data.email,
            displayName: response.data.name,
            role: response.data.role,
            completedRegister: response.data.completedRegister,
        };
        // console.log(userData);
        return userData;
    } catch (error) {
        throw new Error("Error validating session");
    }
}

export const updateUserApi = async (userId: string, data: Partial<CreateUserDTO>) => {
    const res = await masterMindApi.put(userEndpoints.update(userId), data);
    return res.data;
};

export const deleteUserApi = async (userId: string) => {
    const res = await masterMindApi.delete(userEndpoints.delete(userId))
    return res.data;
};
// export const syncUserWithBackend = async (credentials: LoginCredentials): Promise<UserData> => {
//   const response = await axios.post('/api/auth/google', credentials);
//   return response.data; // Retorna el usuario completo (rol, etc.)
// };
