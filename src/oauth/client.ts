import { URLSearchParams } from "node:url";

const authorizeUrl = "https://x.com/i/oauth2/authorize";
const tokenUrl = "https://api.x.com/2/oauth2/token";
const usersMeUrl = "https://api.x.com/2/users/me";

export interface OAuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
}

interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  name?: string;
}

export function buildAuthorizeUrl(options: {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state: string;
  codeChallenge: string;
}): URL {
  const url = new URL(authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", options.clientId);
  url.searchParams.set("redirect_uri", options.redirectUri);
  url.searchParams.set("scope", options.scopes.join(" "));
  url.searchParams.set("state", options.state);
  url.searchParams.set("code_challenge", options.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`X API request failed with ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

function mapOAuthTokenResponse(response: OAuthTokenResponse): OAuthSession {
  return {
    accessToken: response.access_token,
    expiresIn: response.expires_in,
    tokenType: response.token_type,
    scope: response.scope,
    ...(response.refresh_token
      ? { refreshToken: response.refresh_token }
      : {}),
  };
}

export async function exchangeAuthorizationCode(options: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<OAuthSession> {
  const body = new URLSearchParams({
    code: options.code,
    grant_type: "authorization_code",
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    code_verifier: options.codeVerifier,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const tokenResponse = await readJsonResponse<OAuthTokenResponse>(response);
  return mapOAuthTokenResponse(tokenResponse);
}

export async function refreshAccessToken(options: {
  refreshToken: string;
  clientId: string;
}): Promise<OAuthSession> {
  const body = new URLSearchParams({
    refresh_token: options.refreshToken,
    grant_type: "refresh_token",
    client_id: options.clientId,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const tokenResponse = await readJsonResponse<OAuthTokenResponse>(response);
  return mapOAuthTokenResponse(tokenResponse);
}

export async function fetchAuthenticatedUser(
  accessToken: string,
): Promise<AuthenticatedUser> {
  const response = await fetch(usersMeUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await readJsonResponse<{ data: AuthenticatedUser }>(response);
  return payload.data;
}
