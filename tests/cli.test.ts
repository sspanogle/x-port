import { describe, expect, it } from "vitest";
import { runCli } from "../src/cli.js";

describe("cli", () => {
  it("explains how to start when no args are given", async () => {
    const result = await runCli([]);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain("xport --help");
  });

  it("rejects unsupported export formats", async () => {
    const result = await runCli(["export", "--format", "pdf"]);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("Unsupported export format");
  });

  it("requires a client id for login", async () => {
    const result = await runCli(["login"]);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("Missing X client ID");
  });
});
