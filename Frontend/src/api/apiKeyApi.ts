import axios from "axios";
import { axiosInstance } from "./axiosInstance";

export type ApiKeyStatusResponse = {
  issued: boolean;
  active: boolean;
  issuedAt: string | null;
  expiresAt: string | null;
};

export async function getApiKeyStatus() {
  const response = await axiosInstance.get<ApiKeyStatusResponse>("/keys/status");
  return response.data;
}

export async function issueApiKey() {
  const response = await axiosInstance.post<string>("/keys/issue");
  return response.data;
}

export async function reissueApiKey() {
  const response = await axiosInstance.post<string>("/keys/reissue");
  return response.data;
}

export function isApiKeyAlreadyIssuedError(error: unknown) {
  if (!axios.isAxiosError(error) || error.response?.status !== 409) {
    return false;
  }

  const responseData: unknown = error.response.data;

  if (responseData && typeof responseData === "object" && "code" in responseData) {
    return responseData.code === "API_KEY_ALREADY_ISSUED";
  }

  // The issue endpoint's legacy 409 response is a plain-text API_KEY_ALREADY_ISSUED message.
  return typeof responseData === "string" && Boolean(responseData.trim());
}

export function getApiKeyErrorMessage(error: unknown, fallbackMessage: string) {
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
