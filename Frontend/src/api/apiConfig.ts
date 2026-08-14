const DEVELOPMENT_API_ORIGIN = "http://localhost:8080";
const configuredApiOrigin = import.meta.env.VITE_API_BASE_URL || DEVELOPMENT_API_ORIGIN;
const API_ORIGIN = configuredApiOrigin.replace(/\/+$/, "");

export const API_BASE_URL = `${API_ORIGIN}/api`;
