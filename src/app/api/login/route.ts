import { NextRequest, NextResponse } from "next/server";
import { loginWithConfig } from "../../../application/login";
import { loadRuntimeConfig } from "../../../runtime/config";
import { openAppDatabase } from "../../../storage/database";

export const runtime = "nodejs";

function redirectWithMessage(
  request: NextRequest,
  message: string,
  kind: "notice" | "error",
) {
  const url = new URL("/", request.url);
  url.searchParams.set(kind, message);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  const runtimeConfig = loadRuntimeConfig(process.env, process.cwd());
  const db = openAppDatabase(runtimeConfig.dataDir);

  try {
    const output = await loginWithConfig({
      db,
      env: process.env,
      cwd: process.cwd(),
      clientId: runtimeConfig.clientId,
      redirectUri: runtimeConfig.redirectUri,
      scopes: runtimeConfig.scopes,
      openBrowser: runtimeConfig.openBrowser,
    });

    return redirectWithMessage(
      request,
      `Logged in as @${output.user.username} (${output.user.id}).`,
      "notice",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown login error.";
    return redirectWithMessage(request, message, "error");
  }
}
