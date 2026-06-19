export function invalidExportFormatMessage(format: string): string {
  return [
    `Unsupported export format: ${format}`,
    "Supported formats: md, json, csv.",
    "",
  ].join("\n");
}

export function loginSuccessMessage(username: string, userId: string): string {
  return `Connected to X as @${username} (${userId}).\n`;
}

export function exportSuccessMessage(
  format: string,
  outputPath: string,
  bookmarkCount: number,
): string {
  return [
    `Exported ${bookmarkCount} bookmarks to ${outputPath}.`,
    `Format: ${format}`,
    "",
  ].join("\n");
}

export function syncSuccessMessage(
  fetchedCount: number,
  insertedCount: number,
): string {
  return [
    `Fetched ${fetchedCount} bookmarks from X and saved ${insertedCount} new bookmarks locally.`,
    "",
  ].join("\n");
}

export function dashboardSuccessMessage(url: string): string {
  return [
    `Dashboard running at ${url}.`,
    "Use the page to inspect cached bookmarks, sync from X, and export files.",
    "Press Ctrl+C to stop the dashboard.",
    "",
  ].join("\n");
}
