import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  API_ERROR_NAVIGATION_EVENT,
  type ApiErrorNavigationDetail,
} from "./apiError";

export default function ApiErrorNavigator() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const { status } = (event as CustomEvent<ApiErrorNavigationDetail>).detail;
      navigate(status === 403 ? "/forbidden" : "/server-error", { replace: true });
    };

    window.addEventListener(API_ERROR_NAVIGATION_EVENT, handleApiError);
    return () => window.removeEventListener(API_ERROR_NAVIGATION_EVENT, handleApiError);
  }, [navigate]);

  return null;
}
