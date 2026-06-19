import type { Bookmark, BookmarkExport } from "../domain/bookmark.js";

function escapeMarkdown(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll("*", "\\*")
    .replaceAll("_", "\\_")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
    .replaceAll("#", "\\#")
    .replaceAll(">", "\\>");
}

function renderBookmark(bookmark: Bookmark, index: number): string {
  return [
    `## ${index + 1}. ${escapeMarkdown(bookmark.authorName)} (@${escapeMarkdown(bookmark.authorHandle)})`,
    "",
    `> ${escapeMarkdown(bookmark.text)}`,
    "",
    `- URL: ${bookmark.url}`,
    `- Created at: ${bookmark.createdAt}`,
  ].join("\n");
}

export function renderMarkdownExport(exportData: BookmarkExport): string {
  const sections = exportData.bookmarks.map((bookmark, index) =>
    renderBookmark(bookmark, index),
  );

  return [
    "# X-Port Bookmark Export",
    "",
    `Exported at: ${exportData.exportedAt}`,
    `Bookmark count: ${exportData.bookmarks.length}`,
    "",
    ...sections,
    "",
  ].join("\n");
}
