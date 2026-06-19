import type { BookmarkExport, ExportFormat } from "../domain/bookmark";
import { renderCsvExport } from "./csv";
import { renderJsonExport } from "./json";
import { renderMarkdownExport } from "./markdown";

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
