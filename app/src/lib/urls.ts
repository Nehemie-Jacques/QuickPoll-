const PRODUCTION_URL = "https://quick-poll-ba18.vercel.app";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/** Runtime origin (manage links, same-environment navigation). */
export function getBaseUrl(request?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL);
  }

  if (request) {
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (host) {
      const proto =
        request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
      const hostname = host.split(",")[0]?.trim();
      if (hostname) {
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

/** Always shareable base URL for vote links and QR codes (never localhost). */
export function getShareBaseUrl(request?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL);
  }

  if (request) {
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (host) {
      const proto =
        request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
      const hostname = host.split(",")[0]?.trim();
      if (hostname && !isLocalHostname(hostname)) {
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

  return PRODUCTION_URL;
}

export function voteUrl(pollId: string, request?: Request): string {
  return `${getShareBaseUrl(request)}/poll/${pollId}`;
}

/** Client-side public vote URL — safe to copy, share, and encode in QR codes. */
export function clientVoteUrl(pollId: string): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)}/poll/${pollId}`;
  }

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    if (!isLocalHostname(hostname)) {
      return `${origin}/poll/${pollId}`;
    }
  }

  return `${PRODUCTION_URL}/poll/${pollId}`;
}

export function manageUrl(
  pollId: string,
  token: string,
  request?: Request,
): string {
  return `${getBaseUrl(request)}/poll/${pollId}/manage?token=${encodeURIComponent(token)}`;
}

export function resultsUrl(pollId: string, request?: Request): string {
  return `${getShareBaseUrl(request)}/poll/${pollId}/results`;
}

export function qrImageUrl(pollId: string, request?: Request): string {
  return `${getShareBaseUrl(request)}/api/polls/${pollId}/qr`;
}

/** @deprecated Use clientVoteUrl(pollId) */
export function resolvePublicVoteUrl(
  pollId: string,
  _serverUrl?: string,
): string {
  return clientVoteUrl(pollId);
}
