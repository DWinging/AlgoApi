const ACCESS_TOKEN_KEY = "algoapi.accessToken";
export const AUTH_SESSION_EXPIRED_EVENT = "algoapi:session-expired";

type JwtPayload = {
  exp?: number;
};

export function getAccessTokenExpiration(accessToken: string) {
  try {
    const encodedPayload = accessToken.split(".")[1];

    if (!encodedPayload) {
      return null;
    }

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedBase64)) as JwtPayload;

    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(accessToken: string) {
  const expiration = getAccessTokenExpiration(accessToken);
  return expiration === null || expiration <= Date.now();
}

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getValidStoredAccessToken() {
  const accessToken = getStoredAccessToken();

  if (!accessToken || isAccessTokenExpired(accessToken)) {
    clearStoredAccessToken();
    return null;
  }

  return accessToken;
}

export function storeAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearStoredAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function expireAuthSession() {
  clearStoredAccessToken();
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}
