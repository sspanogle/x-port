import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { Bookmark } from "../domain/bookmark";
import { getDatabasePath } from "../runtime/paths";

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
  saveBookmarks(bookmarks: Bookmark[], seenAt: string): Bookmark[];
  listBookmarks(): Bookmark[];
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

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      full_text TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_handle TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      article_json TEXT,
      first_seen_at TEXT NOT NULL
    );
  `);
}

function parseArticle(
  articleJson: string | null,
): Record<string, unknown> | undefined {
  if (!articleJson) {
    return undefined;
  }

  try {
    return JSON.parse(articleJson) as Record<string, unknown>;
  } catch {
    return undefined;
  }
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
            SELECT
              access_token,
              refresh_token,
              expires_at,
              scope,
              token_type,
              user_id,
              username,
              name,
              updated_at
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
            id,
            access_token,
            refresh_token,
            expires_at,
            scope,
            token_type,
            user_id,
            username,
            name,
            updated_at
          ) VALUES (
            1,
            @accessToken,
            @refreshToken,
            @expiresAt,
            @scope,
            @tokenType,
            @userId,
            @username,
            @name,
            @updatedAt
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
    saveBookmarks(bookmarks, seenAt) {
      const insert = db.prepare(
        `
          INSERT OR IGNORE INTO bookmarks (
            id,
            text,
            full_text,
            author_name,
            author_handle,
            url,
            created_at,
            article_json,
            first_seen_at
          ) VALUES (
            @id,
            @text,
            @fullText,
            @authorName,
            @authorHandle,
            @url,
            @createdAt,
            @articleJson,
            @firstSeenAt
          )
        `,
      );

      const inserted: Bookmark[] = [];

      for (const bookmark of bookmarks) {
        const result = insert.run({
          ...bookmark,
          fullText: bookmark.fullText ?? bookmark.text,
          articleJson: bookmark.article
            ? JSON.stringify(bookmark.article)
            : undefined,
          firstSeenAt: seenAt,
        });

        if (result.changes > 0) {
          inserted.push(bookmark);
        }
      }

      return inserted;
    },
    listBookmarks() {
      const rows = db
        .prepare(
          `
            SELECT
              id,
              text,
              full_text,
              author_name,
              author_handle,
              url,
              created_at,
              article_json
            FROM bookmarks
            ORDER BY first_seen_at ASC, id ASC
          `,
        )
        .all() as Array<{
        id: string;
        text: string;
        full_text: string;
        author_name: string;
        author_handle: string;
        url: string;
        created_at: string;
        article_json: string | null;
      }>;

      return rows.map((row) => {
        const article = parseArticle(row.article_json);

        return {
          id: row.id,
          text: row.text,
          fullText: row.full_text,
          authorName: row.author_name,
          authorHandle: row.author_handle,
          url: row.url,
          createdAt: row.created_at,
          ...(article ? { article } : {}),
        };
      });
    },
    saveExport(record) {
      db.prepare(
        `
          INSERT INTO export_runs (
            format,
            exported_at,
            output_path,
            bookmark_count
          ) VALUES (@format, @exportedAt, @outputPath, @bookmarkCount)
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
