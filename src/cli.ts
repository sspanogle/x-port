import { Command } from "commander";
import { z } from "zod";
import {
  invalidExportFormatMessage,
  notImplementedMessage,
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
    .action(() => {
      result = createResult(1, "", notImplementedMessage("login"));
    });

  program
    .command("export")
    .description("Export bookmarks to a local file.")
    .requiredOption("-f, --format <format>", "Export format: md, json, or csv")
    .action((options: { format?: string }) => {
      const parsedFormat = exportFormatSchema.safeParse(options.format);

      if (!parsedFormat.success) {
        result = createResult(
          1,
          "",
          `${invalidExportFormatMessage(options.format ?? "")}\n`,
        );
        return;
      }

      result = createResult(
        1,
        "",
        notImplementedMessage(`export --format ${parsedFormat.data}`),
      );
    });

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
