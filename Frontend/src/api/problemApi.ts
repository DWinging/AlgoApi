import { axiosInstance } from "./axiosInstance";
export { getApiErrorMessage as getProblemErrorMessage } from "./apiError";

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
