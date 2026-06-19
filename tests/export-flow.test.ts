import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { exportBookmarks } from "../src/application/export.js";
import { openAppDatabase } from "../src/storage/database.js";

describe("export flow", () => {
  it("exports bookmarks from the stored session and writes a markdown file", async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-data-"));
    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-exports-"));
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

    const fetchSpy = vi.spyOn(globalThis, "fetch");
    fetchSpy.mockImplementation(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname === "/2/users/2244994945/bookmarks") {
        return new Response(
          JSON.stringify({
            data: [
              {
                id: "1",
                text: "Hello bookmarks",
                created_at: "2026-06-18T20:00:00.000Z",
                author_id: "2",
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
      }

      throw new Error(`Unexpected request: ${url.toString()}`);
    });

    try {
      const output = await exportBookmarks({
        format: "md",
        exportDir,
        clientId: undefined,
        db,
        now: new Date("2026-06-18T21:48:00.000Z"),
      });

      expect(output.bookmarkCount).toBe(1);
      expect(output.outputPath).toContain(
        "bookmarks-2026-06-18T21-48-00-000Z.md",
      );
      expect(fs.existsSync(path.resolve(output.outputPath))).toBe(true);

      const content = fs.readFileSync(path.resolve(output.outputPath), "utf8");
      expect(content).toContain("Ada Lovelace (@ada)");
      expect(content).toContain("Hello bookmarks");
    } finally {
      fetchSpy.mockRestore();
      db.close();
    }
  });
});
