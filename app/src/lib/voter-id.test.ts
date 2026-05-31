import { describe, expect, it } from "vitest";
import { buildVoterId, hashIp } from "./voter-id";

describe("voter-id", () => {
  it("produces stable hash for same inputs", () => {
    const a = buildVoterId("Mozilla", "fr", hashIp("1.2.3.4", "salt"));
    const b = buildVoterId("Mozilla", "fr", hashIp("1.2.3.4", "salt"));
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
  });

  it("differs when IP changes", () => {
    const a = buildVoterId("Mozilla", "fr", hashIp("1.2.3.4", "salt"));
    const b = buildVoterId("Mozilla", "fr", hashIp("5.6.7.8", "salt"));
    expect(a).not.toBe(b);
  });
});
