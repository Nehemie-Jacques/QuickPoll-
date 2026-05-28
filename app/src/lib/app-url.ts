export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function pollVoteUrl(pollId: string): string {
  return `${getAppBaseUrl()}/poll/${pollId}`;
}

export function pollManageUrl(pollId: string, token: string): string {
  return `${getAppBaseUrl()}/poll/${pollId}/manage?token=${encodeURIComponent(token)}`;
}

export function pollResultsUrl(pollId: string): string {
  return `${getAppBaseUrl()}/poll/${pollId}/results`;
}
