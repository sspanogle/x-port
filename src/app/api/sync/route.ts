import { NextRequest, NextResponse } from "next/server";
import { syncBookmarks } from "../../../application/sync";
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const runtimeConfig = loadRuntimeConfig(process.env, process.cwd());
  const db = openAppDatabase(runtimeConfig.dataDir);

  try {
    const output = await syncBookmarks(
      runtimeConfig.clientId
        ? { db, clientId: runtimeConfig.clientId }
        : { db },
    );

    return redirectWithMessage(
      request,
      `Fetched ${output.fetchedCount} bookmarks from X and saved ${output.insertedCount} new bookmarks locally.`,
      "notice",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error.";
    return redirectWithMessage(request, message, "error");
  } finally {
    db.close();
  }
}
