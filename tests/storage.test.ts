import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { openAppDatabase } from "../src/storage/database.js";

describe("storage", () => {
  it("saves and loads the current oauth session", () => {
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
});
