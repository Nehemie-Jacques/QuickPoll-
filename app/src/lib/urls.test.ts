import { describe, expect, it } from "vitest";
import {
  clientVoteUrl,
  getBaseUrl,
  getShareBaseUrl,
  resolvePublicVoteUrl,
  voteUrl,
} from "./urls";

describe("urls", () => {
  it("uses NEXT_PUBLIC_APP_URL when set", () => {
    const prev = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://quick-poll-ba18.vercel.app";
    expect(voteUrl("abc123")).toBe(
      "https://quick-poll-ba18.vercel.app/poll/abc123",
    );
    process.env.NEXT_PUBLIC_APP_URL = prev;
  });

  it("derives base URL from request headers", () => {
    const prevPublic = process.env.NEXT_PUBLIC_APP_URL;
    const prevVercel = process.env.VERCEL_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_URL;

    const request = new Request("https://ignored", {
      headers: {
        "x-forwarded-host": "quick-poll-ba18.vercel.app",
        "x-forwarded-proto": "https",
      },
    });
    expect(getBaseUrl(request)).toBe("https://quick-poll-ba18.vercel.app");
    expect(getShareBaseUrl(request)).toBe(
      "https://quick-poll-ba18.vercel.app",
    );

    if (prevPublic !== undefined) process.env.NEXT_PUBLIC_APP_URL = prevPublic;
    if (prevVercel !== undefined) process.env.VERCEL_URL = prevVercel;
  });

  it("share URLs fall back to production instead of localhost", () => {
    const prevPublic = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;

    expect(voteUrl("xyz")).toBe("https://quick-poll-ba18.vercel.app/poll/xyz");
    expect(getShareBaseUrl()).toBe("https://quick-poll-ba18.vercel.app");
    expect(getBaseUrl()).toBe("http://localhost:3000");

    if (prevPublic !== undefined) process.env.NEXT_PUBLIC_APP_URL = prevPublic;
  });

  it("resolvePublicVoteUrl returns public vote path", () => {
    const prev = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://quick-poll-ba18.vercel.app";
    expect(resolvePublicVoteUrl("xyz", "http://localhost:3000/poll/xyz")).toBe(
      "https://quick-poll-ba18.vercel.app/poll/xyz",
    );
    expect(clientVoteUrl("xyz")).toBe(
      "https://quick-poll-ba18.vercel.app/poll/xyz",
    );
    process.env.NEXT_PUBLIC_APP_URL = prev;
  });
});
