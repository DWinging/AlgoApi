import axios from "axios";
import { axiosInstance } from "./axiosInstance";

export type SignupRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userID: number;
  accessToken: string;
};

export async function signup(request: SignupRequest) {
  await axiosInstance.post<void>("/auth/signup", request);
}

export async function login(request: LoginRequest) {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", request);
  return response.data;
}

export function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const responseData: unknown = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const message = "message" in responseData ? responseData.message : undefined;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (!error.response) {
    return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }

  return fallbackMessage;
}
