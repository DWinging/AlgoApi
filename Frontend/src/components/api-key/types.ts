export type ApiKeyInfo = {
  status: "active" | "inactive";
  issuedAt?: string;
  expiresAt?: string;
};
