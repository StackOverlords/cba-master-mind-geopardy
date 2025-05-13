import axios from "axios";
import type { LoginCredentials } from "../shared/types";
import { useAuthStore } from "../stores/authStore";

export const loginUser = async (user: LoginCredentials) => {
    const response = await axios.post("users/create", user);
    useAuthStore.getState().setUser(user);
    return response.data;
};
