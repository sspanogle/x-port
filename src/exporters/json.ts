import type { BookmarkExport } from "../domain/bookmark";

export function renderJsonExport(exportData: BookmarkExport): string {
  return `${JSON.stringify(
    {
      exportedAt: exportData.exportedAt,
      format: "json",
      bookmarks: exportData.bookmarks,
    },
    null,
    2,
  )}\n`;
}
