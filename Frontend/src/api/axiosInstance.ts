import axios from "axios";
import { expireAuthSession, getStoredAccessToken } from "../auth/auth-storage";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

export const axiosInstance = axios.create({
  baseURL: configuredBaseUrl || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && getStoredAccessToken()) {
      expireAuthSession();
    }

    return Promise.reject(error);
  },
);
