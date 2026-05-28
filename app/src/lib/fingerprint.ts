import { createHash } from "crypto";

export function hashFingerprint(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function buildVoterFingerprint(
  userAgent: string | null,
  acceptLanguage: string | null,
  ipHash: string,
): string {
  const raw = [userAgent ?? "", acceptLanguage ?? "", ipHash].join("|");
  return hashFingerprint(raw);
}

export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
