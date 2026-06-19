import process from "node:process";
import type { Bookmark } from "../domain/bookmark";
import type { StoredSession } from "../storage/database";
import { loadRuntimeConfig, type RuntimeConfig } from "../runtime/config";
import { openAppDatabase } from "../storage/database";

export interface DashboardState {
  session: StoredSession | undefined;
  bookmarks: Bookmark[];
  dataDir: string;
  exportDir: string;
  runtime: RuntimeConfig;
}

export function loadDashboardState(
  env: NodeJS.ProcessEnv = process.env,
  cwd = process.cwd(),
  dataDir?: string,
  exportDir?: string,
): DashboardState {
  const runtime = loadRuntimeConfig(env, cwd);
  const db = openAppDatabase(dataDir ?? runtime.dataDir);

  try {
    return {
      session: db.getSession(),
      bookmarks: db.listBookmarks(),
      dataDir: dataDir ?? runtime.dataDir,
      exportDir: exportDir ?? runtime.exportDir,
      runtime,
    };
  } finally {
    db.close();
  }
}
