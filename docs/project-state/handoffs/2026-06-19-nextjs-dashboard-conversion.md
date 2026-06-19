# 2026-06-19 Next.js Dashboard Conversion

## Summary

Converted the localhost dashboard into a Next.js App Router application while keeping the existing CLI, SQLite cache, and sync/export application logic intact.

## What Changed

- added `src/app/` with the local dashboard page, layout, styles, and route handlers
- kept bookmark/session loading in shared application and storage layers
- replaced Next-facing `.js` source import specifiers with extensionless imports across `src/` so `next build` can resolve the shared TS modules
- updated the CLI build to run `node scripts/fix-dist-imports.mjs` after `tsc`, restoring `.js` suffixes inside `dist/` for Node ESM

## Validation

- `npm run build:web`
- `npm run build:cli`
- `npm run build`
- `npm test`
- `npm run lint`

## Run

- `npm run dev`
- open `http://localhost:3000`

## Notes

- the dashboard shows cached bookmarks pulled into SQLite
- the local-only boundary remains unchanged: `sync` may call X, `export` reads local state only
