import { describe, expect, it } from "vitest";
import type { BookmarkExport } from "../src/domain/bookmark.js";
import { renderCsvExport } from "../src/exporters/csv.js";
import { renderJsonExport } from "../src/exporters/json.js";
import { renderMarkdownExport } from "../src/exporters/markdown.js";

const sampleExport: BookmarkExport = {
  exportedAt: "2026-06-18T21:40:00.000Z",
  bookmarks: [
    {
      id: "1",
      text: "Bookmark text with *markdown* and commas, too",
      authorName: "Ada Lovelace",
      authorHandle: "ada",
      url: "https://x.com/ada/status/1",
      createdAt: "2026-06-17T12:00:00.000Z",
    },
  ],
};

describe("exporters", () => {
  it("renders markdown exports", () => {
    const output = renderMarkdownExport(sampleExport);

    expect(output).toContain("# X-Port Bookmark Export");
    expect(output).toContain("Ada Lovelace (@ada)");
    expect(output).toContain("\\*markdown\\*");
  });

  it("renders json exports", () => {
    const output = renderJsonExport(sampleExport);
    const parsed = JSON.parse(output);

    expect(parsed).toEqual({
      exportedAt: sampleExport.exportedAt,
      format: "json",
      bookmarks: sampleExport.bookmarks,
    });
  });

  it("renders csv exports", () => {
    const output = renderCsvExport(sampleExport);

    expect(output).toContain(
      "id,text,authorName,authorHandle,url,createdAt,exportedAt",
    );
    expect(output).toContain('"Bookmark text with *markdown* and commas, too"');
  });
});
