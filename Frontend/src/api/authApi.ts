import { axiosInstance } from "./axiosInstance";
export { getApiErrorMessage as getAuthErrorMessage } from "./apiError";

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
