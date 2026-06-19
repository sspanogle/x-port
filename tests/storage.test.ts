import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { openAppDatabase } from "../src/storage/database.js";

describe("storage", () => {
  it("saves and loads current oauth session", () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-storage-"));
    const db = openAppDatabase(dataDir);

    try {
      db.saveSession({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresAt: "2026-06-18T22:00:00.000Z",
        scope: "tweet.read users.read bookmark.read offline.access",
        tokenType: "bearer",
        userId: "123",
        username: "ada",
        name: "Ada Lovelace",
        updatedAt: "2026-06-18T21:55:00.000Z",
      });

      expect(db.getSession()).toEqual({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresAt: "2026-06-18T22:00:00.000Z",
        scope: "tweet.read users.read bookmark.read offline.access",
        tokenType: "bearer",
        userId: "123",
        username: "ada",
        name: "Ada Lovelace",
        updatedAt: "2026-06-18T21:55:00.000Z",
      });
    } finally {
      db.close();
    }
  });

  it("stores and returns each bookmark id only once", () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "x-port-storage-"));
    const db = openAppDatabase(dataDir);

    try {
      const firstPass = db.saveBookmarks(
        [
          {
            id: "1",
            text: "Bookmark text",
            fullText: "Full bookmark text",
            authorName: "Ada Lovelace",
            authorHandle: "ada",
            url: "https://x.com/i/web/status/1",
            createdAt: "2026-06-18T20:00:00.000Z",
            article: {
              title: "Article title",
            },
          },
        ],
        "2026-06-18T22:00:00.000Z",
      );

      const secondPass = db.saveBookmarks(
        [
          {
            id: "1",
            text: "Bookmark text",
            fullText: "Full bookmark text",
            authorName: "Ada Lovelace",
            authorHandle: "ada",
            url: "https://x.com/i/web/status/1",
            createdAt: "2026-06-18T20:00:00.000Z",
            article: {
              title: "Article title",
            },
          },
        ],
        "2026-06-18T22:10:00.000Z",
      );

      expect(firstPass).toHaveLength(1);
      expect(secondPass).toHaveLength(0);
      expect(db.listBookmarks()).toEqual([
        {
          id: "1",
          text: "Bookmark text",
          fullText: "Full bookmark text",
          authorName: "Ada Lovelace",
          authorHandle: "ada",
          url: "https://x.com/i/web/status/1",
          createdAt: "2026-06-18T20:00:00.000Z",
          article: {
            title: "Article title",
          },
        },
      ]);
    } finally {
      db.close();
    }
  });
});
