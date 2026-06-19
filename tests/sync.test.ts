import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { syncBookmarks } from "../src/application/sync.js";
import { openAppDatabase } from "../src/storage/database.js";

describe("sync flow", () => {
  it("fetches bookmarks from the API and stores new ids locally", async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-data-"));
    const db = openAppDatabase(dataDir);

    db.saveSession({
      accessToken: "access-token",
      refreshToken: undefined,
      expiresAt: "2999-01-01T00:00:00.000Z",
      scope: "tweet.read users.read bookmark.read offline.access",
      tokenType: "bearer",
      userId: "2244994945",
      username: "XDevelopers",
      name: "X Developers",
      updatedAt: "2026-06-18T21:55:00.000Z",
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => {
        return new Response(
          JSON.stringify({
            data: [
              {
                id: "1",
                text: "Short fallback text",
                created_at: "2026-06-18T20:00:00.000Z",
                author_id: "2",
                note_tweet: {
                  full_text: "Full note tweet content for markdown export.",
                },
                article: {
                  title: "Article title",
                  text: "Article body content",
                },
              },
            ],
            includes: {
              users: [
                {
                  id: "2",
                  username: "ada",
                  name: "Ada Lovelace",
                },
              ],
            },
            meta: {},
          }),
          { status: 200 },
        );
      });

    try {
      const first = await syncBookmarks({ db });

      expect(fetchSpy).toHaveBeenCalled();
      expect(first.fetchedCount).toBe(1);
      expect(first.insertedCount).toBe(1);
      expect(db.listBookmarks()).toHaveLength(1);

      const second = await syncBookmarks({ db });
      expect(second.fetchedCount).toBe(1);
      expect(second.insertedCount).toBe(0);
      expect(db.listBookmarks()).toHaveLength(1);
    } finally {
      fetchSpy.mockRestore();
      db.close();
    }
  });
});
