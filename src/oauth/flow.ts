import http from "node:http";
import { spawn } from "node:child_process";
import { URL } from "node:url";
import {
  buildAuthorizeUrl,
  exchangeAuthorizationCode,
  fetchAuthenticatedUser,
  type OAuthSession,
} from "./client.js";
import {
  createCodeChallenge,
  createCodeVerifier,
  createState,
} from "./pkce.js";

export interface OAuthLoginResult {
  session: OAuthSession;
  user: {
    id: string;
    username: string;
    name?: string;
  };
}

async function waitForAuthorizationCode(
  redirectUri: string,
  expectedState: string,
): Promise<{ code: string }> {
  const redirect = new URL(redirectUri);
  if (
    redirect.protocol !== "http:" ||
    (redirect.hostname !== "127.0.0.1" && redirect.hostname !== "localhost")
  ) {
    throw new Error(
      "Redirect URI must use http://127.0.0.1 or localhost for the built-in callback server.",
    );
  }

  return await new Promise<{ code: string }>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const requestUrl = new URL(req.url ?? "/", redirect);
        const state = requestUrl.searchParams.get("state");
        const code = requestUrl.searchParams.get("code");
        const error = requestUrl.searchParams.get("error");

        if (state !== expectedState) {
          res.statusCode = 400;
          res.end("State mismatch.");
          reject(new Error("OAuth callback state mismatch."));
          return;
        }

        if (error) {
          res.statusCode = 400;
          res.end(`OAuth error: ${error}`);
          reject(new Error(`OAuth authorization failed: ${error}`));
          return;
        }

        if (!code) {
          res.statusCode = 400;
          res.end("Missing authorization code.");
          reject(
            new Error("OAuth callback did not include an authorization code."),
          );
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Authorization received. You can close this tab.");
        server.close();
        resolve({ code });
      } catch (error) {
        server.close();
        reject(error);
      }
    });

    server.listen(
      redirect.port ? Number(redirect.port) : 8787,
      redirect.hostname,
    );
  });
}

function openUrl(url: string): void {
  const platform = process.platform;
  const command =
    platform === "darwin" ? "open" : platform === "win32" ? "cmd" : "xdg-open";
  const args = platform === "win32" ? ["/c", "start", "", url] : [url];

  const child = spawn(command, args, {
    stdio: "ignore",
    detached: true,
  });

  child.unref();
}

export async function runOAuthLogin(options: {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  openBrowser: boolean;
}): Promise<OAuthLoginResult> {
  const codeVerifier = createCodeVerifier();
  const codeChallenge = createCodeChallenge(codeVerifier);
  const state = createState();
  const authorizeUrl = buildAuthorizeUrl({
    clientId: options.clientId,
    redirectUri: options.redirectUri,
    scopes: options.scopes,
    state,
    codeChallenge,
  });

  if (options.openBrowser) {
    openUrl(authorizeUrl.toString());
  }

  const { code } = await waitForAuthorizationCode(options.redirectUri, state);
  const session = await exchangeAuthorizationCode({
    code,
    clientId: options.clientId,
    redirectUri: options.redirectUri,
    codeVerifier,
  });
  const user = await fetchAuthenticatedUser(session.accessToken);

  return { session, user };
}
