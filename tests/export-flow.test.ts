import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { exportBookmarks } from "../src/application/export.js";
import { openAppDatabase } from "../src/storage/database.js";

describe("exportBookmarks", () => {
  const cleanupPaths: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();

    for (const cleanupPath of cleanupPaths.splice(0)) {
      fs.rmSync(cleanupPath, { recursive: true, force: true });
    }
  });

  it("writes one markdown file per bookmark without calling fetch", () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-data-"));
    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-exports-"));
    cleanupPaths.push(dataDir, exportDir);

    const db = openAppDatabase(dataDir);

    db.saveBookmarks(
      [
        {
          id: "1",
          text: "First bookmark",
          authorName: "Ada Lovelace",
          authorHandle: "ada",
          url: "https://x.com/i/web/status/1",
          createdAt: "2026-06-18T20:00:00.000Z",
          article: { title: "First Article" },
        },
        {
          id: "2",
          text: "Second bookmark",
          authorName: "Grace Hopper",
          authorHandle: "grace",
          url: "https://x.com/i/web/status/2",
          createdAt: "2026-06-18T20:05:00.000Z",
        },
      ],
      "2026-06-18T21:47:00.000Z",
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const output = exportBookmarks({
      format: "md",
      exportDir,
      db,
      now: new Date("2026-06-18T21:48:00.000Z"),
    });

    expect(output.bookmarkCount).toBe(2);
    expect(path.basename(output.outputPath)).toBe(
      "bookmarks-2026-06-18T21-48-00-000Z",
    );
    expect(output.outputPaths).toHaveLength(2);
    expect(fetchSpy).not.toHaveBeenCalled();

    const exportedFiles = fs
      .readdirSync(output.outputPath)
      .filter((entry) => entry.endsWith(".md"))
      .sort();

    expect(exportedFiles).toHaveLength(2);
    expect(exportedFiles[0]).toContain("ada-1.md");
    expect(exportedFiles[1]).toContain("grace-2.md");

    const firstBookmark = fs.readFileSync(output.outputPaths[0], "utf8");
    const secondBookmark = fs.readFileSync(output.outputPaths[1], "utf8");

    expect(firstBookmark).toContain("First bookmark");
    expect(firstBookmark).toContain("First Article");
    expect(secondBookmark).toContain("Second bookmark");
  });
});
