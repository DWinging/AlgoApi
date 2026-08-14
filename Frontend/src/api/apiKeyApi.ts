import { axiosInstance } from "./axiosInstance";
export { getApiErrorMessage as getApiKeyErrorMessage } from "./apiError";

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
