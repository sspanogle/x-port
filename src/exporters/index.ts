import type { BookmarkExport, ExportFormat } from "../domain/bookmark.js";
import { renderCsvExport } from "./csv.js";
import { renderJsonExport } from "./json.js";
import { renderMarkdownExport } from "./markdown.js";

export function renderExport(
  format: ExportFormat,
  exportData: BookmarkExport,
): string {
  switch (format) {
    case "md":
      return renderMarkdownExport(exportData);
    case "json":
      return renderJsonExport(exportData);
    case "csv":
      return renderCsvExport(exportData);
  }
}
