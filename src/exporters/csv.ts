import type { BookmarkExport } from "../domain/bookmark";

function escapeCsvCell(value: string): string {
  if (/[,"\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

export function renderCsvExport(exportData: BookmarkExport): string {
  const header = [
    "id",
    "text",
    "authorName",
    "authorHandle",
    "url",
    "createdAt",
    "exportedAt",
  ];
  const rows = exportData.bookmarks.map((bookmark) =>
    [
      bookmark.id,
      bookmark.text,
      bookmark.authorName,
      bookmark.authorHandle,
      bookmark.url,
      bookmark.createdAt,
      exportData.exportedAt,
    ]
      .map(escapeCsvCell)
      .join(","),
  );

  return [...[header.join(",")], ...rows, ""].join("\n");
}
