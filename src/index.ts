import process from "node:process";
import { runCli } from "./cli";

async function main(): Promise<void> {
  const result = await runCli(process.argv.slice(2));

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  process.exitCode = result.code;
}

void main();
