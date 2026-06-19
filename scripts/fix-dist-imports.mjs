import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");

const importFromPattern =
  /((?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["'])(\.\.?(?:\/[^"'()]+)+)(["'])/g;
const dynamicImportPattern = /((?:import)\(\s*["'])(\.\.?(?:\/[^"'()]+)+)(["']\s*\))/g;

function withJsExtension(specifier) {
  if (path.extname(specifier) || specifier.endsWith("/")) {
    return specifier;
  }

  return `${specifier}.js`;
}

function rewriteImports(source) {
  return source
    .replace(importFromPattern, (_, prefix, specifier, suffix) => {
      return `${prefix}${withJsExtension(specifier)}${suffix}`;
    })
    .replace(dynamicImportPattern, (_, prefix, specifier, suffix) => {
      return `${prefix}${withJsExtension(specifier)}${suffix}`;
    });
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!entry.isFile() || !fullPath.endsWith(".js")) {
      continue;
    }

    const original = await readFile(fullPath, "utf8");
    const rewritten = rewriteImports(original);

    if (rewritten !== original) {
      await writeFile(fullPath, rewritten, "utf8");
    }
  }
}

const distStat = await stat(distDir).catch(() => undefined);

if (!distStat?.isDirectory()) {
  throw new Error(`Missing dist directory: ${distDir}`);
}

await walk(distDir);
