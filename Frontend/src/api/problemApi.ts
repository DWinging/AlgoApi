import axios from "axios";
import { axiosInstance } from "./axiosInstance";

export type ProblemResponse = {
  id: number;
  platform: string;
  number: number;
  title: string;
  level: string;
  url: string;
  algorithms: string[];
  createdAt: string;
};

export type ProblemHistoryResponse = {
  allocatedDate: string;
  id: number;
  platform: string;
  number: number;
  title: string;
  level: string;
  url: string;
  algorithms: string[];
};

export async function getDailyProblem() {
  const response = await axiosInstance.get<ProblemResponse>("/problems/recommend");
  return response.data;
}

export async function getProblemHistory() {
  const response = await axiosInstance.get<ProblemHistoryResponse[]>("/problems/history");
  return response.data;
}

export function getProblemErrorMessage(error: unknown, fallbackMessage: string) {
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
