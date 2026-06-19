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
  const content = bookmark.fullText ?? bookmark.text;
  const parts = [
    `## ${index + 1}. ${escapeMarkdown(bookmark.authorName)} (@${escapeMarkdown(bookmark.authorHandle)})`,
    "",
    `> ${escapeMarkdown(content)}`,
    "",
    `- URL: ${bookmark.url}`,
    `- Created at: ${bookmark.createdAt}`,
  ];

  if (bookmark.article) {
    parts.push(
      "",
      "### Raw Article",
      "```json",
      JSON.stringify(bookmark.article, null, 2),
      "```",
    );
  }

  return parts.join("\n");
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
