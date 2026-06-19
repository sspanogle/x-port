import fs from "node:fs";
import path from "node:path";
import { renderExport } from "../exporters/index.js";
import { getExportFilePath } from "../runtime/paths.js";
import { createXApiClient } from "../x-api/client.js";
import { fetchBookmarks } from "../x-api/bookmarks.js";
import type { AppDatabase, StoredSession } from "../storage/database.js";
import { ensureExportDir } from "../storage/database.js";

export interface ExportOutput {
  outputPath: string;
  bookmarkCount: number;
  exportedAt: string;
}

function isExpired(session: StoredSession): boolean {
  return Date.parse(session.expiresAt) <= Date.now() + 30_000;
}

async function loadValidSession(
  db: AppDatabase,
  clientId?: string,
): Promise<StoredSession> {
  const session = db.getSession();
  if (!session) {
    throw new Error("No saved X session found. Run `xport login` first.");
  }

  if (!isExpired(session)) {
    return session;
  }

  if (!session.refreshToken) {
    throw new Error("Saved X session has expired and cannot be refreshed.");
  }

  if (!clientId) {
    throw new Error(
      "Missing X client ID for token refresh. Set X_PORT_CLIENT_ID.",
    );
  }

  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: session.refreshToken,
      grant_type: "refresh_token",
      client_id: clientId,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to refresh X access token: ${response.status} ${text}`,
    );
  }

  const refreshed = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };

  const updatedSession: StoredSession = {
    ...session,
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token ?? session.refreshToken,
    expiresAt: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    scope: refreshed.scope,
    tokenType: refreshed.token_type,
    updatedAt: new Date().toISOString(),
  };

  db.saveSession(updatedSession);
  return updatedSession;
}

export async function exportBookmarks(options: {
  format: "md" | "json" | "csv";
  exportDir: string;
  db: AppDatabase;
  clientId: string | undefined;
  now?: Date;
}): Promise<ExportOutput> {
  const exportedAt = options.now?.toISOString() ?? new Date().toISOString();
  const session = await loadValidSession(options.db, options.clientId);
  const client = createXApiClient(session.accessToken);
  const bookmarks = await fetchBookmarks(client, session.userId);
  const output = renderExport(options.format, { exportedAt, bookmarks });

  ensureExportDir(options.exportDir);
  const outputPath = getExportFilePath(
    options.exportDir,
    options.format,
    exportedAt,
  );
  fs.writeFileSync(path.resolve(outputPath), output, "utf8");

  options.db.saveExport({
    format: options.format,
    exportedAt,
    outputPath,
    bookmarkCount: bookmarks.length,
  });

  return {
    outputPath,
    bookmarkCount: bookmarks.length,
    exportedAt,
  };
}
