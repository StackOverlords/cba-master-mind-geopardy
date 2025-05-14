import axios from "axios";
import type { LoginCredentials } from "../shared/types";
import { useAuthStore } from "../stores/authStore";

export const createUserApi = async (user: LoginCredentials) => {
    const userExists = await axios.get(`users/firebase/${user.firebaseUid}`);
    if (!userExists.data) {
        const response = await axios.post("users/create", user);
        useAuthStore.getState().setUser(user);
        return response.data;
    }
    return userExists.data;
};
