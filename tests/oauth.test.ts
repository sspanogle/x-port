import { describe, expect, it } from "vitest";
import { buildAuthorizeUrl } from "../src/oauth/client.js";
import {
  createCodeChallenge,
  createCodeVerifier,
  createState,
} from "../src/oauth/pkce.js";

describe("oauth helpers", () => {
  it("builds an X authorize url with the expected query parameters", () => {
    const url = buildAuthorizeUrl({
      clientId: "client-123",
      redirectUri: "http://127.0.0.1:8787/callback",
      scopes: ["tweet.read", "users.read", "bookmark.read", "offline.access"],
      state: "state-123",
      codeChallenge: "challenge-123",
    });

    expect(url.toString()).toContain("https://x.com/i/oauth2/authorize");
    expect(url.searchParams.get("client_id")).toBe("client-123");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://127.0.0.1:8787/callback",
    );
    expect(url.searchParams.get("scope")).toBe(
      "tweet.read users.read bookmark.read offline.access",
    );
    expect(url.searchParams.get("state")).toBe("state-123");
    expect(url.searchParams.get("code_challenge")).toBe("challenge-123");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  });

  it("creates url-safe pkce values", () => {
    const verifier = createCodeVerifier();
    const challenge = createCodeChallenge(verifier);
    const state = createState();

    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
