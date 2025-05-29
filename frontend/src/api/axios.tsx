import axios from "axios";
import { apiVariables } from "../config/env";
import { useAuthStore } from "../stores/authStore";

export const masterMindApi = axios.create({
    baseURL: apiVariables.apiUrl || "https://api.example.com",
    headers: {
        "Content-Type": "application/json",
    },
})

masterMindApi.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().user?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);