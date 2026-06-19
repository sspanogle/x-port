import type { Bookmark, BookmarkExport } from "../domain/bookmark";

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

function renderArticleSection(article: Record<string, unknown>): string[] {
  const lines: string[] = ["### Article"];
  const title = typeof article.title === "string" ? article.title : undefined;
  const body = typeof article.text === "string" ? article.text : undefined;
  const coverMedia =
    article.cover_media && typeof article.cover_media === "object"
      ? (article.cover_media as Record<string, unknown>)
      : undefined;
  const entities =
    article.entities && typeof article.entities === "object"
      ? (article.entities as Record<string, unknown>)
      : undefined;
  const urls = Array.isArray(entities?.urls)
    ? (entities?.urls as Record<string, unknown>[])
    : [];

  if (title) {
    lines.push(`- Title: ${escapeMarkdown(title)}`);
  }

  if (body) {
    lines.push(`- Body: ${escapeMarkdown(body)}`);
  }

  if (urls.length > 0) {
    lines.push("- Links:");
    for (const entry of urls) {
      const expandedUrl =
        typeof entry.expanded_url === "string"
          ? entry.expanded_url
          : typeof entry.url === "string"
            ? entry.url
            : undefined;
      const displayUrl =
        typeof entry.display_url === "string"
          ? entry.display_url
          : (expandedUrl ?? "unknown");

      lines.push(
        `  - ${escapeMarkdown(displayUrl)}${expandedUrl ? ` (${expandedUrl})` : ""}`,
      );
    }
  }

  if (coverMedia) {
    const coverParts: string[] = [];
    if (typeof coverMedia.type === "string") {
      coverParts.push(`type: ${coverMedia.type}`);
    }
    if (typeof coverMedia.url === "string") {
      coverParts.push(`url: ${coverMedia.url}`);
    }
    if (typeof coverMedia.preview_image_url === "string") {
      coverParts.push(`preview_image_url: ${coverMedia.preview_image_url}`);
    }
    if (coverParts.length > 0) {
      lines.push(`- Cover media: ${coverParts.join(", ")}`);
    }
  }

  lines.push(
    "",
    "### Raw Article Metadata",
    "```json",
    JSON.stringify(article, null, 2),
    "```",
  );
  return lines;
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
    parts.push("", ...renderArticleSection(bookmark.article));
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
