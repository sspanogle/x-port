import path from "node:path";

export interface RuntimeConfig {
  dataDir: string;
  exportDir: string;
  clientId: string | undefined;
  redirectUri: string;
  scopes: string[];
  openBrowser: boolean;
}

const defaultScopes = [
  "tweet.read",
  "users.read",
  "bookmark.read",
  "offline.access",
];

function parseScopes(value: string | undefined): string[] {
  if (!value) {
    return defaultScopes;
  }

  return value
    .split(/[,\s]+/)
    .map((scope) => scope.trim())
    .filter(Boolean);
}

export function loadRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
): RuntimeConfig {
  return {
    dataDir: env.X_PORT_DATA_DIR ?? path.join(cwd, ".x-port"),
    exportDir: env.X_PORT_EXPORT_DIR ?? path.join(cwd, "exports"),
    clientId: env.X_PORT_CLIENT_ID,
    redirectUri: env.X_PORT_REDIRECT_URI ?? "http://127.0.0.1:8788/callback",
    scopes: parseScopes(env.X_PORT_SCOPES),
    openBrowser: env.X_PORT_OPEN_BROWSER !== "false",
  };
}
