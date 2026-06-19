import { loadRuntimeConfig } from "../runtime/config";
import { runOAuthLogin } from "../oauth/flow";
import type { AppDatabase, StoredSession } from "../storage/database";

export interface LoginResult {
  user: {
    id: string;
    username: string;
    name?: string;
  };
  session: StoredSession;
}

export async function loginWithConfig(options: {
  clientId: string | undefined;
  redirectUri: string | undefined;
  scopes: string[] | undefined;
  openBrowser: boolean | undefined;
  db: AppDatabase;
  env?: NodeJS.ProcessEnv;
  cwd?: string;
}): Promise<LoginResult> {
  const runtime = loadRuntimeConfig(options.env, options.cwd);
  const clientId = options.clientId ?? runtime.clientId;
  const redirectUri = options.redirectUri ?? runtime.redirectUri;
  const scopes = options.scopes ?? runtime.scopes;
  const openBrowser = options.openBrowser ?? runtime.openBrowser;

  if (!clientId) {
    throw new Error(
      "Missing X client ID. Set X_PORT_CLIENT_ID or pass --client-id.",
    );
  }

  const login = await runOAuthLogin({
    clientId,
    redirectUri,
    scopes,
    openBrowser,
  });

  const session: StoredSession = {
    accessToken: login.session.accessToken,
    expiresAt: new Date(
      Date.now() + login.session.expiresIn * 1000,
    ).toISOString(),
    scope: login.session.scope,
    tokenType: login.session.tokenType,
    userId: login.user.id,
    username: login.user.username,
    updatedAt: new Date().toISOString(),
    ...(login.session.refreshToken
      ? { refreshToken: login.session.refreshToken }
      : { refreshToken: undefined }),
    ...(login.user.name ? { name: login.user.name } : { name: undefined }),
  };

  options.db.saveSession(session);

  return {
    user: login.user,
    session,
  };
}
