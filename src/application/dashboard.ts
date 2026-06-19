import http from "node:http";
import { spawn } from "node:child_process";
import { exportBookmarks } from "./export";
import { syncBookmarks } from "./sync";
import type { AppDatabase } from "../storage/database";
import { renderDashboardPage } from "../presentation/dashboard";

export interface StartDashboardOptions {
  db: AppDatabase;
  dataDir: string;
  exportDir: string;
  host: string;
  port: number;
  clientId: string | undefined;
  openBrowser: boolean;
  syncBookmarks?: typeof syncBookmarks;
  exportBookmarks?: typeof exportBookmarks;
}

export interface StartedDashboard {
  server: http.Server;
  url: string;
}

function openUrl(url: string): void {
  const platform = process.platform;
  const command =
    platform === "darwin" ? "open" : platform === "win32" ? "cmd" : "xdg-open";

  if (platform === "win32") {
    spawn(command, ["/c", "start", url], { detached: true, stdio: "ignore" });
    return;
  }

  spawn(command, [url], { detached: true, stdio: "ignore" });
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown dashboard error.";
}

function readBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    request.on("data", (chunk: Buffer) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function redirect(location: string, response: http.ServerResponse): void {
  response.statusCode = 303;
  response.setHeader("Location", location);
  response.end();
}

function normalizeHostForUrl(host: string): string {
  if (host === "0.0.0.0" || host === "::") {
    return "127.0.0.1";
  }

  return host;
}

function getListeningPort(server: http.Server, fallback: number): number {
  const address = server.address();
  if (address && typeof address === "object") {
    return address.port;
  }

  return fallback;
}

export async function startDashboard(
  options: StartDashboardOptions,
): Promise<StartedDashboard> {
  const syncFn = options.syncBookmarks ?? syncBookmarks;
  const exportFn = options.exportBookmarks ?? exportBookmarks;

  const server = http.createServer(async (request, response) => {
    const listeningPort = getListeningPort(server, options.port);
    const requestUrl = new URL(
      request.url ?? "/",
      `http://${normalizeHostForUrl(options.host)}:${listeningPort}`,
    );

    try {
      if (request.method === "GET" && requestUrl.pathname === "/") {
        const notice = requestUrl.searchParams.get("notice") ?? undefined;
        const error = requestUrl.searchParams.get("error") ?? undefined;
        const session = options.db.getSession();
        const bookmarks = options.db.listBookmarks();
        const pageModel = {
          title: "X-Port Dashboard",
          serverUrl: `http://${normalizeHostForUrl(options.host)}:${listeningPort}`,
          dataDir: options.dataDir,
          exportDir: options.exportDir,
          session,
          bookmarks,
          notice,
          error,
        };

        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(renderDashboardPage(pageModel));
        return;
      }

      if (request.method === "POST" && requestUrl.pathname === "/sync") {
        const clientId = options.clientId;
        const output = await syncFn(
          clientId ? { db: options.db, clientId } : { db: options.db },
        );
        redirect(
          `/?notice=${encodeURIComponent(
            `Fetched ${output.fetchedCount} bookmarks from X and saved ${output.insertedCount} new bookmarks locally.`,
          )}`,
          response,
        );
        return;
      }

      if (request.method === "POST" && requestUrl.pathname === "/export") {
        const body = await readBody(request);
        const params = new URLSearchParams(body);
        const format = params.get("format") ?? "md";
        const output = await exportFn({
          db: options.db,
          format: format as "md" | "json" | "csv",
          exportDir: options.exportDir,
        });

        redirect(
          `/?notice=${encodeURIComponent(
            `Exported ${output.bookmarkCount} bookmarks to ${output.outputPath}.`,
          )}`,
          response,
        );
        return;
      }

      response.statusCode = 404;
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.end("Not found.");
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(
        renderDashboardPage({
          title: "X-Port Dashboard",
          serverUrl: `http://${normalizeHostForUrl(options.host)}:${listeningPort}`,
          dataDir: options.dataDir,
          exportDir: options.exportDir,
          session: options.db.getSession(),
          bookmarks: options.db.listBookmarks(),
          notice: undefined,
          error: formatError(error),
        }),
      );
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(options.port, options.host, resolve);
  });

  server.on("close", () => {
    options.db.close();
  });

  const url = `http://${normalizeHostForUrl(options.host)}:${getListeningPort(server, options.port)}`;
  if (options.openBrowser) {
    openUrl(url);
  }

  return { server, url };
}
