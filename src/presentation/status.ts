export function invalidExportFormatMessage(format: string): string {
  return [
    `Unsupported export format: ${format}`,
    "Supported formats: md, json, csv",
    "",
  ].join("\n");
}

export function loginSuccessMessage(username: string, userId: string): string {
  return `Connected X account @${username} (${userId}).\n`;
}

export function exportSuccessMessage(
  format: string,
  outputPath: string,
  bookmarkCount: number,
): string {
  return [
    `Exported ${bookmarkCount} bookmarks as ${format}.`,
    `Wrote file: ${outputPath}`,
    "",
  ].join("\n");
}
