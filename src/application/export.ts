import fs from "node:fs";
import path from "node:path";
import type { Bookmark, ExportFormat } from "../domain/bookmark";
import { renderExport } from "../exporters/index";
import { renderMarkdownExport } from "../exporters/markdown";
import { getExportFilePath } from "../runtime/paths";
import { ensureExportDir, type AppDatabase } from "../storage/database";

export interface ExportResult {
  outputPath: string;
  outputPaths: string[];
  bookmarkCount: number;
}

function safeTimestamp(value: string): string {
  return value.replaceAll(":", "-").replaceAll(".", "-");
}

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");

  return normalized || "bookmark";
}

function getMarkdownExportDirectory(exportDir: string, exportedAt: string): string {
  return path.join(exportDir, `bookmarks-${safeTimestamp(exportedAt)}`);
}

function getMarkdownBookmarkPath(
  exportDirectory: string,
  bookmark: Bookmark,
  index: number,
): string {
  const createdAt = safeTimestamp(bookmark.createdAt);
  const handle = slugify(bookmark.authorHandle);
  const bookmarkId = slugify(bookmark.id);

  return path.join(
    exportDirectory,
    `${String(index + 1).padStart(4, "0")}-${createdAt}-${handle}-${bookmarkId}.md`,
  );
}

function writeMarkdownBookmarks(options: {
  bookmarks: Bookmark[];
  exportDir: string;
  exportedAt: string;
}): ExportResult {
  const exportDirectory = getMarkdownExportDirectory(
    options.exportDir,
    options.exportedAt,
  );

  fs.mkdirSync(path.resolve(exportDirectory), { recursive: true });

  const outputPaths = options.bookmarks.map((bookmark, index) => {
    const outputPath = getMarkdownBookmarkPath(exportDirectory, bookmark, index);
    const output = renderMarkdownExport({
      exportedAt: options.exportedAt,
      bookmarks: [bookmark],
    });

    fs.writeFileSync(path.resolve(outputPath), output, "utf8");
    return outputPath;
  });

  return {
    outputPath: exportDirectory,
    outputPaths,
    bookmarkCount: options.bookmarks.length,
  };
}

function writeSingleExportFile(options: {
  bookmarks: Bookmark[];
  exportDir: string;
  exportedAt: string;
  format: ExportFormat;
}): ExportResult {
  const outputPath = getExportFilePath(
    options.exportDir,
    options.format,
    options.exportedAt,
  );
  const output = renderExport(options.format, {
    exportedAt: options.exportedAt,
    bookmarks: options.bookmarks,
  });

  fs.writeFileSync(path.resolve(outputPath), output, "utf8");

  return {
    outputPath,
    outputPaths: [outputPath],
    bookmarkCount: options.bookmarks.length,
  };
}

export function exportBookmarks(options: {
  format: ExportFormat;
  exportDir: string;
  db: AppDatabase;
  now?: Date;
}): ExportResult {
  ensureExportDir(options.exportDir);

  const bookmarks = options.db.listBookmarks();
  const exportedAt = options.now?.toISOString() ?? new Date().toISOString();

  const result =
    options.format === "md"
      ? writeMarkdownBookmarks({
          bookmarks,
          exportDir: options.exportDir,
          exportedAt,
        })
      : writeSingleExportFile({
          bookmarks,
          exportDir: options.exportDir,
          exportedAt,
          format: options.format,
        });

  options.db.saveExport({
    format: options.format,
    exportedAt,
    outputPath: result.outputPath,
    bookmarkCount: bookmarks.length,
  });

  return result;
}
