import axios from "axios";

export type BusinessErrorResponse = {
  code: string;
  message: string;
};

export const API_ERROR_NAVIGATION_EVENT = "algoapi:api-error-navigation";

export type ApiErrorNavigationDetail = {
  status: 403 | 500;
};

export function navigateForApiError(status: ApiErrorNavigationDetail["status"]) {
  window.dispatchEvent(
    new CustomEvent<ApiErrorNavigationDetail>(API_ERROR_NAVIGATION_EVENT, {
      detail: { status },
    }),
  );
}

function getBusinessErrorResponse(data: unknown): BusinessErrorResponse | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const code = "code" in data ? data.code : undefined;
  const message = "message" in data ? data.message : undefined;

  if (typeof code !== "string" || typeof message !== "string" || !message.trim()) {
    return null;
  }

  return { code, message };
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  if (!error.response) {
    return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }

  if (error.response.status >= 500) {
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  const businessError = getBusinessErrorResponse(error.response.data);

  if (businessError) {
    return businessError.message;
  }

  // Keep compatibility with endpoints that still return a plain-text error body.
  if (typeof error.response.data === "string" && error.response.data.trim()) {
    return error.response.data;
  }

  return fallbackMessage;
}
