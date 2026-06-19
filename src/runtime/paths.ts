import path from "node:path";

export function getDatabasePath(dataDir: string): string {
  return path.join(dataDir, "x-port.sqlite");
}

export function getExportFilePath(
  exportDir: string,
  format: string,
  exportedAt: string,
): string {
  const safeTimestamp = exportedAt.replaceAll(":", "-").replaceAll(".", "-");
  return path.join(exportDir, `bookmarks-${safeTimestamp}.${format}`);
}
