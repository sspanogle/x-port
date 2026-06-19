import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { getDatabasePath } from "../runtime/paths.js";

export interface StoredSession {
  accessToken: string;
  refreshToken: string | undefined;
  expiresAt: string;
  scope: string;
  tokenType: string;
  userId: string;
  username: string;
  name: string | undefined;
  updatedAt: string;
}

export interface ExportRecord {
  format: string;
  exportedAt: string;
  outputPath: string;
  bookmarkCount: number;
}

export interface AppDatabase {
  getSession(): StoredSession | undefined;
  saveSession(session: StoredSession): void;
  saveExport(record: ExportRecord): void;
  close(): void;
}

function initializeSchema(db: Database.Database): void {
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS auth_session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      expires_at TEXT NOT NULL,
      scope TEXT NOT NULL,
      token_type TEXT NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      name TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS export_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      format TEXT NOT NULL,
      exported_at TEXT NOT NULL,
      output_path TEXT NOT NULL,
      bookmark_count INTEGER NOT NULL
    );
  `);
}

export function openAppDatabase(dataDir: string): AppDatabase {
  fs.mkdirSync(dataDir, { recursive: true });
  const databasePath = getDatabasePath(dataDir);
  const db = new Database(databasePath);
  initializeSchema(db);

  return {
    getSession() {
      const row = db
        .prepare(
          `
            SELECT access_token, refresh_token, expires_at, scope, token_type, user_id, username, name, updated_at
            FROM auth_session
            WHERE id = 1
          `,
        )
        .get() as
        | {
            access_token: string;
            refresh_token: string | undefined;
            expires_at: string;
            scope: string;
            token_type: string;
            user_id: string;
            username: string;
            name: string | undefined;
            updated_at: string;
          }
        | undefined;

      if (!row) {
        return undefined;
      }

      return {
        accessToken: row.access_token,
        refreshToken: row.refresh_token,
        expiresAt: row.expires_at,
        scope: row.scope,
        tokenType: row.token_type,
        userId: row.user_id,
        username: row.username,
        name: row.name,
        updatedAt: row.updated_at,
      };
    },
    saveSession(session) {
      db.prepare(
        `
          INSERT INTO auth_session (
            id, access_token, refresh_token, expires_at, scope, token_type, user_id, username, name, updated_at
          )
          VALUES (
            1, @accessToken, @refreshToken, @expiresAt, @scope, @tokenType, @userId, @username, @name, @updatedAt
          )
          ON CONFLICT(id) DO UPDATE SET
            access_token = excluded.access_token,
            refresh_token = excluded.refresh_token,
            expires_at = excluded.expires_at,
            scope = excluded.scope,
            token_type = excluded.token_type,
            user_id = excluded.user_id,
            username = excluded.username,
            name = excluded.name,
            updated_at = excluded.updated_at
        `,
      ).run({
        ...session,
      });
    },
    saveExport(record) {
      db.prepare(
        `
          INSERT INTO export_runs (format, exported_at, output_path, bookmark_count)
          VALUES (@format, @exportedAt, @outputPath, @bookmarkCount)
        `,
      ).run(record);
    },
    close() {
      db.close();
    },
  };
}

export function ensureExportDir(exportDir: string): void {
  fs.mkdirSync(path.resolve(exportDir), { recursive: true });
}
