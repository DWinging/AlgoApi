import axios from "axios";
import {
  expireAuthSession,
  getStoredAccessToken,
  getValidStoredAccessToken,
} from "../auth/auth-storage";
import { API_BASE_URL } from "./apiConfig";
import { navigateForApiError } from "./apiError";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getValidStoredAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const isLoginRequest = error.config?.url?.endsWith("/auth/login") ?? false;

    if (status === 401 && !isLoginRequest) {
      expireAuthSession();
    } else if (status === 403) {
      if (getStoredAccessToken()) {
        navigateForApiError(403);
      } else {
        expireAuthSession();
      }
    } else if (status >= 500) {
      navigateForApiError(500);
    }

    return Promise.reject(error);
  },
);
