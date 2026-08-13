import { createContext, useContext } from "react";
import type { LoginRequest, LoginResponse } from "../api/authApi";

export type AuthContextValue = {
  accessToken: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
