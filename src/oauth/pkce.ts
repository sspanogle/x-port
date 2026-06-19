import { createHash, randomBytes } from "node:crypto";

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function createCodeVerifier(): string {
  return base64UrlEncode(randomBytes(32));
}

export function createCodeChallenge(verifier: string): string {
  return base64UrlEncode(createHash("sha256").update(verifier).digest());
}

export function createState(): string {
  return base64UrlEncode(randomBytes(16));
}
