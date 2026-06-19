import { Command } from "commander";
import { z } from "zod";
import { exportBookmarks } from "./application/export.js";
import { loginWithConfig } from "./application/login.js";
import { loadRuntimeConfig } from "./runtime/config.js";
import { openAppDatabase } from "./storage/database.js";
import {
  exportSuccessMessage,
  invalidExportFormatMessage,
  loginSuccessMessage,
} from "./presentation/status.js";

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

export async function runCli(argv: readonly string[]): Promise<CliResult> {
  if (argv.length === 0) {
    return createResult(0, "Use `xport --help` to see available commands.\n");
  }

  let result = createResult(0);
  const program = new Command();
  program
    .name("xport")
    .description("Export X bookmarks into durable local formats.")
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
    .option("--no-open", "Do not open the authorization URL in a browser")
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
    .command("export")
    .description("Export bookmarks to a local file.")
    .requiredOption("-f, --format <format>", "Export format: md, json, or csv")
    .option("--client-id <id>", "X OAuth client ID")
    .option("--data-dir <dir>", "Directory used for local app data")
    .option("--export-dir <dir>", "Directory for exported files")
    .action(
      async (options: {
        format?: string;
        clientId?: string;
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
            clientId: options.clientId ?? runtime.clientId,
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
    await program.parseAsync([...argv], { from: "user" });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      String((error as { code?: unknown }).code) === "commander.helpDisplayed"
    ) {
      return createResult(0, result.stdout, result.stderr);
    }

    if (error instanceof Error) {
      return createResult(
        1,
        result.stdout,
        `${result.stderr}${error.message}\n`,
      );
    }

    return createResult(1, result.stdout, "Unknown CLI error.\n");
  }

  return result;
}
