import { verifyCreatorToken } from "@/lib/creator-token";

export function isManageContext(request: Request): boolean {
  const referer = request.headers.get("referer") ?? "";
  if (referer.includes("/manage")) return true;
  if (request.headers.get("x-manage-context") === "1") return true;
  const url = new URL(request.url);
  return url.searchParams.has("token");
}

export function getCreatorToken(request: Request): string | null {
  const url = new URL(request.url);
  return (
    url.searchParams.get("token") ??
    request.headers.get("x-creator-token") ??
    request.headers.get("x-manage-token")
  );
}

export async function verifyManageToken(
  request: Request,
  pollId: string,
): Promise<boolean> {
  const token = getCreatorToken(request);
  if (!token) return false;
  const verified = await verifyCreatorToken(token);
  return verified?.pollId === pollId;
}
