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
