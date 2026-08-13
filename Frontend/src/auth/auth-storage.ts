const ACCESS_TOKEN_KEY = "algoapi.accessToken";
const USER_ID_KEY = "algoapi.userId";
export const AUTH_SESSION_EXPIRED_EVENT = "algoapi:session-expired";

type JwtPayload = {
  exp?: number;
  sub?: string;
};

function getAccessTokenPayload(accessToken: string) {
  try {
    const encodedPayload = accessToken.split(".")[1];

    if (!encodedPayload) {
      return null;
    }

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(paddedBase64)) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAccessTokenExpiration(accessToken: string) {
  const payload = getAccessTokenPayload(accessToken);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
}

export function getAccessTokenUserId(accessToken: string) {
  const subject = getAccessTokenPayload(accessToken)?.sub;
  const userId = subject ? Number(subject) : Number.NaN;
  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
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
    clearStoredAuthSession();
    return null;
  }

  return accessToken;
}

export function getStoredUserId() {
  const storedUserId = localStorage.getItem(USER_ID_KEY);
  const userId = storedUserId ? Number(storedUserId) : Number.NaN;
  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
}

export function storeAuthSession(accessToken: string, userId: number) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_ID_KEY, String(userId));
}

export function clearStoredAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function expireAuthSession() {
  clearStoredAuthSession();
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}
