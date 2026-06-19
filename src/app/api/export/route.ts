import { NextRequest, NextResponse } from "next/server";
import { exportBookmarks } from "../../../application/export";
import { loadRuntimeConfig } from "../../../runtime/config";
import { openAppDatabase } from "../../../storage/database";

export const runtime = "nodejs";

function redirectWithMessage(
  request: NextRequest,
  message: string,
  kind: "notice" | "error",
): NextResponse {
  const url = new URL("/", request.url);
  url.searchParams.set(kind, message);
  return NextResponse.redirect(url, { status: 303 });
}

function parseFormat(value: FormDataEntryValue | null): "md" | "json" | "csv" {
  if (value === "json" || value === "csv") {
    return value;
  }

  return "md";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const runtimeConfig = loadRuntimeConfig(process.env, process.cwd());
  const db = openAppDatabase(runtimeConfig.dataDir);

  try {
    const formData = await request.formData();
    const format = parseFormat(formData.get("format"));
    const output = await exportBookmarks({
      db,
      format,
      exportDir: runtimeConfig.exportDir,
    });

    return redirectWithMessage(
      request,
      `Exported ${output.bookmarkCount} bookmarks to ${output.outputPath}.`,
      "notice",
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown export error.";
    return redirectWithMessage(request, message, "error");
  } finally {
    db.close();
  }
}
