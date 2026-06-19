import { Command } from "commander";
import { z } from "zod";
import { exportBookmarks } from "./application/export";
import { startDashboard } from "./application/dashboard";
import { loginWithConfig } from "./application/login";
import { syncBookmarks } from "./application/sync";
import { loadRuntimeConfig } from "./runtime/config";
import { openAppDatabase } from "./storage/database";
import {
  dashboardSuccessMessage,
  exportSuccessMessage,
  invalidExportFormatMessage,
  loginSuccessMessage,
  syncSuccessMessage,
} from "./presentation/status";

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

const exportFormatSchema = z.enum(["md", "json", "csv"]);

function createResult(code: number, stdout = "", stderr = ""): CliResult {
  return { code, stdout, stderr };
}

function parseScopes(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }

  return value
    .split(/[,\s]+/)
    .map((scope) => scope.trim())
    .filter(Boolean);
}

export async function runCli(argv: string[]): Promise<CliResult> {
  let result = createResult(0);

  const program = new Command();
  program
    .name("xport")
    .description("Export your X bookmarks into durable local formats.")
    .exitOverride();
  program.configureOutput({
    writeOut: (str) => {
      result = { ...result, stdout: `${result.stdout}${str}` };
    },
    writeErr: (str) => {
      result = { ...result, stderr: `${result.stderr}${str}` };
    },
  });

  program
    .command("login")
    .description("Authenticate with X using your own credentials.")
    .option("--client-id <id>", "X OAuth client ID")
    .option("--redirect-uri <uri>", "OAuth redirect URI")
    .option("--scopes <scopes>", "Comma or space separated OAuth scopes")
    .option("--no-open", "Do not open authorization URL in a browser")
    .option("--data-dir <dir>", "Directory used for local app data")
    .action(
      async (options: {
        clientId?: string;
        redirectUri?: string;
        scopes?: string;
        open?: boolean;
        dataDir?: string;
      }) => {
        const runtime = loadRuntimeConfig(process.env, process.cwd());
        const db = openAppDatabase(options.dataDir ?? runtime.dataDir);
        try {
          const output = await loginWithConfig({
            clientId: options.clientId,
            redirectUri: options.redirectUri,
            scopes: parseScopes(options.scopes),
            openBrowser: options.open ?? runtime.openBrowser,
            db,
            env: process.env,
            cwd: process.cwd(),
          });

          result = createResult(
            0,
            loginSuccessMessage(output.user.username, output.user.id),
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown login error.";
          result = createResult(1, "", `${message}\n`);
        } finally {
          db.close();
        }
      },
    );

  program
    .command("sync")
    .description("Fetch bookmarks from X and store them in SQLite.")
    .option("--client-id <id>", "X OAuth client ID")
    .option("--data-dir <dir>", "Directory used for local app data")
    .action(async (options: { clientId?: string; dataDir?: string }) => {
      const runtime = loadRuntimeConfig(process.env, process.cwd());
      const db = openAppDatabase(options.dataDir ?? runtime.dataDir);
      try {
        const clientId = options.clientId ?? runtime.clientId;
        const output = await syncBookmarks(
          clientId ? { db, clientId } : { db },
        );

        result = createResult(
          0,
          syncSuccessMessage(output.fetchedCount, output.insertedCount),
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown sync error.";
        result = createResult(1, "", `${message}\n`);
      } finally {
        db.close();
      }
    });

  program
    .command("dashboard")
    .description("Open a local dashboard for bookmarks and exports.")
    .option("--client-id <id>", "X OAuth client ID")
    .option("--data-dir <dir>", "Directory used for local app data")
    .option("--export-dir <dir>", "Directory for exported files")
    .option("--host <host>", "Host to bind the dashboard server", "127.0.0.1")
    .option("--port <port>", "Port to bind the dashboard server", "8788")
    .option("--no-open", "Do not open the dashboard in a browser")
    .action(
      async (options: {
        clientId?: string;
        dataDir?: string;
        exportDir?: string;
        host?: string;
        port?: string;
        open?: boolean;
      }) => {
        const runtime = loadRuntimeConfig(process.env, process.cwd());
        const db = openAppDatabase(options.dataDir ?? runtime.dataDir);
        try {
          const clientId = options.clientId ?? runtime.clientId;
          const started = await startDashboard({
            db,
            dataDir: options.dataDir ?? runtime.dataDir,
            exportDir: options.exportDir ?? runtime.exportDir,
            host: options.host ?? "127.0.0.1",
            port: Number(options.port ?? 8788),
            openBrowser: options.open ?? runtime.openBrowser,
            clientId: clientId ?? undefined,
          });

          result = createResult(0, dashboardSuccessMessage(started.url));
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown dashboard error.";
          result = createResult(1, "", `${message}
`);
          db.close();
        }
      },
    );

  program
    .command("export")
    .description("Export locally cached bookmarks into a file.")
    .requiredOption("-f, --format <format>", "Export format: md, json, or csv")
    .option("--data-dir <dir>", "Directory used for local app data")
    .option("--export-dir <dir>", "Directory for exported files")
    .action(
      async (options: {
        format?: string;
        dataDir?: string;
        exportDir?: string;
      }) => {
        const parsedFormat = exportFormatSchema.safeParse(options.format);
        if (!parsedFormat.success) {
          result = createResult(
            1,
            "",
            `${invalidExportFormatMessage(options.format ?? "")}\n`,
          );
          return;
        }

        const runtime = loadRuntimeConfig(process.env, process.cwd());
        const db = openAppDatabase(options.dataDir ?? runtime.dataDir);
        try {
          const output = await exportBookmarks({
            format: parsedFormat.data,
            exportDir: options.exportDir ?? runtime.exportDir,
            db,
          });

          result = createResult(
            0,
            exportSuccessMessage(
              parsedFormat.data,
              output.outputPath,
              output.bookmarkCount,
            ),
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown export error.";
          result = createResult(1, "", `${message}\n`);
        } finally {
          db.close();
        }
      },
    );

  try {
    if (argv.length === 0) {
      return createResult(
        0,
        `${program.helpInformation()}\nRun xport --help for usage.\n`,
      );
    }

    await program.parseAsync(argv, { from: "user" });
  } catch {
    if (result.code === 0) {
      return createResult(1, result.stdout, "Unknown CLI error.\n");
    }
  }

  return result;
}
