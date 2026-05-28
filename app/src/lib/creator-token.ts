import { SignJWT, jwtVerify } from "jose";

const ISSUER = "quickpoll";

function getSecret(): Uint8Array {
  const secret = process.env.CREATOR_JWT_SECRET;
  if (!secret) {
    throw new Error("CREATOR_JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signCreatorToken(pollId: string): Promise<string> {
  return new SignJWT({ pollId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(getSecret());
}

export async function verifyCreatorToken(
  token: string,
): Promise<{ pollId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
    });
    const pollId = payload.pollId;
    if (typeof pollId !== "string") return null;
    return { pollId };
  } catch {
    return null;
  }
}

export function extractManageToken(searchParams: URLSearchParams): string | null {
  return searchParams.get("token");
}
