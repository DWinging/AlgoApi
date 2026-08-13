import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as requestLogin, type LoginRequest } from "../api/authApi";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearStoredAccessToken,
  expireAuthSession,
  getAccessTokenExpiration,
  getValidStoredAccessToken,
  storeAccessToken,
} from "./auth-storage";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(getValidStoredAccessToken);

  useEffect(() => {
    const handleSessionExpired = () => {
      setAccessToken(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [navigate]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const expiration = getAccessTokenExpiration(accessToken);

    if (expiration === null || expiration <= Date.now()) {
      expireAuthSession();
      return;
    }

    const expirationTimer = window.setTimeout(expireAuthSession, expiration - Date.now());
    return () => window.clearTimeout(expirationTimer);
  }, [accessToken]);

  const login = useCallback(async (request: LoginRequest) => {
    const response = await requestLogin(request);
    storeAccessToken(response.accessToken);
    setAccessToken(response.accessToken);
    return response;
  }, []);

  const logout = useCallback(() => {
    clearStoredAccessToken();
    setAccessToken(null);
  }, []);

  const value = useMemo(
    () => ({ accessToken, isAuthenticated: Boolean(accessToken), login, logout }),
    [accessToken, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
