import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

const ACCESS_TOKEN_KEY = "algoapi.accessToken";

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY),
  );

  const login = useCallback((token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setAccessToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAccessToken(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(accessToken), login, logout }),
    [accessToken, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
