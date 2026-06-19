import { createXApiClient } from "../x-api/client";
import { fetchBookmarks } from "../x-api/bookmarks";
import type { AppDatabase, StoredSession } from "../storage/database";

export interface SyncOutput {
  fetchedCount: number;
  insertedCount: number;
  syncedAt: string;
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
      `Failed refresh X access token: ${response.status} ${text}`,
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

export async function syncBookmarks(options: {
  db: AppDatabase;
  clientId?: string;
  now?: Date;
}): Promise<SyncOutput> {
  const syncedAt = options.now?.toISOString() ?? new Date().toISOString();
  const session = await loadValidSession(options.db, options.clientId);
  const client = createXApiClient(session.accessToken);
  const fetchedBookmarks = await fetchBookmarks(client, session.userId);
  const insertedBookmarks = options.db.saveBookmarks(
    fetchedBookmarks,
    syncedAt,
  );

  return {
    fetchedCount: fetchedBookmarks.length,
    insertedCount: insertedBookmarks.length,
    syncedAt,
  };
}
