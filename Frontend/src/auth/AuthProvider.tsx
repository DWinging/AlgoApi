import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as requestLogin, type LoginRequest } from "../api/authApi";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearStoredAuthSession,
  expireAuthSession,
  getAccessTokenExpiration,
  getAccessTokenUserId,
  getStoredUserId,
  getValidStoredAccessToken,
  storeAuthSession,
} from "./auth-storage";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(getValidStoredAccessToken);
  const [userId, setUserId] = useState<number | null>(() =>
    getStoredUserId() ?? (accessToken ? getAccessTokenUserId(accessToken) : null),
  );

  useEffect(() => {
    const handleSessionExpired = () => {
      setAccessToken(null);
      setUserId(null);
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
    storeAuthSession(response.accessToken, response.userID);
    setAccessToken(response.accessToken);
    setUserId(response.userID);
    return response;
  }, []);

  const logout = useCallback(() => {
    clearStoredAuthSession();
    setAccessToken(null);
    setUserId(null);
  }, []);

  const value = useMemo(
    () => ({ accessToken, userId, isAuthenticated: Boolean(accessToken && userId), login, logout }),
    [accessToken, userId, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
