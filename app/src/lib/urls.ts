export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function voteUrl(pollId: string): string {
  return `${getBaseUrl()}/poll/${pollId}`;
}

export function manageUrl(pollId: string, token: string): string {
  return `${getBaseUrl()}/poll/${pollId}/manage?token=${encodeURIComponent(token)}`;
}

export function resultsUrl(pollId: string): string {
  return `${getBaseUrl()}/poll/${pollId}/results`;
}
