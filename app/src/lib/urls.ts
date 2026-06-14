const PRODUCTION_URL = "https://quick-poll-ba18.vercel.app";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/** Canonical public base URL for share links (vote, QR, embed). */
export function getBaseUrl(request?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL);
  }

  if (request) {
    const host =
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host");
    if (host) {
      const proto =
        request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
      const hostname = host.split(",")[0]?.trim();
      if (hostname && !hostname.startsWith("localhost")) {
        return `${proto}://${hostname}`;
      }
    }
  }

  if (process.env.VERCEL_ENV === "production") {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    return PRODUCTION_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function voteUrl(pollId: string, request?: Request): string {
  return `${getBaseUrl(request)}/poll/${pollId}`;
}

export function manageUrl(
  pollId: string,
  token: string,
  request?: Request,
): string {
  return `${getBaseUrl(request)}/poll/${pollId}/manage?token=${encodeURIComponent(token)}`;
}

export function resultsUrl(pollId: string, request?: Request): string {
  return `${getBaseUrl(request)}/poll/${pollId}/results`;
}

export function qrImageUrl(pollId: string, request?: Request): string {
  return `${getBaseUrl(request)}/api/polls/${pollId}/qr`;
}

/** Client-side: always use current origin for public vote links when possible. */
export function resolvePublicVoteUrl(pollId: string, serverUrl: string): string {
  if (typeof window === "undefined") return serverUrl;

  try {
    const parsed = new URL(serverUrl);
    const isLocal =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (isLocal) {
      return `${window.location.origin}/poll/${pollId}`;
    }
  } catch {
    return `${window.location.origin}/poll/${pollId}`;
  }

  return serverUrl;
}
