import { createHash } from "crypto";

export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Stable voter id from browser fingerprint + hashed IP. */
export function buildVoterId(
  userAgent: string | null,
  acceptLanguage: string | null,
  ipHash: string,
): string {
  const raw = [userAgent ?? "", acceptLanguage ?? "", ipHash].join("|");
  return createHash("sha256").update(raw).digest("hex");
}

export function voterIdFromRequest(request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = hashIp(ip, process.env.IP_HASH_SALT ?? "quickpoll");
  return buildVoterId(
    request.headers.get("user-agent"),
    request.headers.get("accept-language"),
    ipHash,
  );
}
