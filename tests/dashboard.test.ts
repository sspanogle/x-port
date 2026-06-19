import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { startDashboard } from "../src/application/dashboard.js";
import { exportBookmarks as realExportBookmarks } from "../src/application/export.js";
import { syncBookmarks as realSyncBookmarks } from "../src/application/sync.js";
import { openAppDatabase } from "../src/storage/database.js";

describe("dashboard", () => {
  let activeServer: Awaited<ReturnType<typeof startDashboard>> | undefined;

  afterEach(async () => {
    await new Promise<void>((resolve) => {
      activeServer?.server.close(() => resolve());
      if (!activeServer) {
        resolve();
      }
    });
    activeServer = undefined;
  });

  it("renders cached bookmarks and accepts sync and export actions", async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-dashboard-data-"));
    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-dashboard-export-"));
    const db = openAppDatabase(dataDir);
    const syncBookmarks = vi.fn(async () => ({
      fetchedCount: 2,
      insertedCount: 1,
    })) as unknown as typeof realSyncBookmarks;
    const exportBookmarks = vi.fn(async () => ({
      bookmarkCount: 1,
      outputPath: path.join(exportDir, "bookmarks.md"),
    })) as unknown as typeof realExportBookmarks;

    db.saveBookmarks(
      [
        {
          id: "1",
          text: "Dashboard bookmark",
          fullText: "Full dashboard bookmark text.",
          authorName: "Ada Lovelace",
          authorHandle: "ada",
          url: "https://x.com/i/web/status/1",
          createdAt: "2026-06-18T20:00:00.000Z",
          article: {
            title: "Article title",
            text: "Article body content",
          },
        },
      ],
      "2026-06-18T22:00:00.000Z",
    );

    activeServer = await startDashboard({
      db,
      dataDir,
      exportDir,
      host: "127.0.0.1",
      port: 0,
      clientId: "client-123",
      openBrowser: false,
      syncBookmarks,
      exportBookmarks,
    });

    try {
      const pageResponse = await fetch(activeServer.url);
      expect(pageResponse.status).toBe(200);

      const page = await pageResponse.text();
      expect(page).toContain("X-Port Dashboard");
      expect(page).toContain("Dashboard bookmark");
      expect(page).toContain("Full dashboard bookmark text.");
      expect(page).toContain("Article title");
      expect(page).toContain("Sync bookmarks");
      expect(page).toContain("Export Markdown");

      const syncResponse = await fetch(new URL("/sync", activeServer.url), {
        method: "POST",
        redirect: "manual",
      });
      expect(syncResponse.status).toBe(303);
      expect(syncBookmarks).toHaveBeenCalledTimes(1);
      expect(syncResponse.headers.get("location")).toContain("notice=");

      const exportResponse = await fetch(new URL("/export", activeServer.url), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "format=md",
        redirect: "manual",
      });
      expect(exportResponse.status).toBe(303);
      expect(exportBookmarks).toHaveBeenCalledTimes(1);
      expect(exportResponse.headers.get("location")).toContain("notice=");
    } finally {
      db.close();
    }
  });
});
