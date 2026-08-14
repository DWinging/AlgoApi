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

export function getLoginErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }

  if (!error.response || error.response.status === 502) {
    return "서버에 연결할 수 없습니다.";
  }

  if (error.response.status === 500) {
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  const responseData: unknown = error.response.data;
  const errorCode =
    responseData && typeof responseData === "object" && "code" in responseData
      ? responseData.code
      : undefined;

  if (error.response.status === 401 && errorCode === "LOGIN_FAILED") {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }

  return getAuthErrorMessage(error, "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
