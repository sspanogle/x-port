# Implementation Status

## Purpose

Track how the current codebase maps to the PRDs and TDDs. This document is the working status layer between:

- product intent in `docs/product/prd/`
- technical guardrails in `docs/engineering/tdd/`
- actual implemented code in the repository

Update it when meaningful implementation milestones land.

---

## Current Summary

Current application status:

- framework bootstrapped into repository
- product technical docs seeded for the X-Port scope
- initial CLI/package scaffold is in place
- local SQLite persistence is implemented
- OAuth PKCE helpers and X API wiring are implemented
- `xport sync` fetches bookmarks from X and stores them in SQLite
- `xport export` reads cached bookmarks from SQLite and writes Markdown, JSON, and CSV files locally
- bookmark cache persists stable X bookmark ids in SQLite and skips repeats on later syncs
- Markdown exports prefer full note-tweet content and include raw article metadata when present
- terminal success copy is clearer for login, sync, and export commands
- OAuth callback recovery guidance is clearer in the browser tab
- local dashboard renders cached bookmarks and exposes sync/export actions

---

## PRD Coverage

### `product/prd/001-product-foundation.md`

Status: in progress

Implemented:

- project scope local-first guardrails
- CLI/package scaffold
- pure export formatter layer
- local persistence layer

Not yet implemented:

- broader configuration ergonomics
- polished operator success messaging

### `product/prd/002-mvp-experience.md`

Status: in progress

Implemented:

- `xport login` command shell
- `xport sync` command shell
- `xport export --format` command shell
- login flow persists OAuth session and authenticated user identity
- sync flow reads stored session, fetches bookmarks, and writes them into SQLite
- export flow reads cached bookmarks and writes local files
- Markdown export renders full note-tweet content when available

Not yet implemented:

- browserless auth fallback
- richer success and error copy

### `product/prd/003-domain-rules.md`

Status: in progress

Implemented:

- domain vocabulary drafted
- bookmark and export types
- bookmark fetch mapping from X API responses
- export record persistence
- bookmark cache persistence keyed by stable bookmark id
- full-text bookmark fields are now modeled in the domain

Deferred design:

- persistence schema details beyond the MVP slice

### `product/prd/004-platform-and-accessibility.md`

Status: in progress

Implemented:

- local-first platform direction defined
- Node.js CLI scaffold and terminal-first output
- stable exit codes and explicit file output messages

Not yet implemented:

- broader accessibility review
- command copy callback flow polishing

### `product/prd/005-future-direction.md`

Status: planned

Implemented:

- future scope boundaries documented

Not yet implemented:

- implementation of deferred features

### `product/prd/006-user-flows.md`

Status: in progress

Implemented:

- high-level login and export flows documented
- login, sync, and export command paths exist in code
- sync flow supports local refresh and local cache writes
- export flow supports local file output from the SQLite cache
- export Markdown now includes long-form content when the API provides it

Not yet implemented:

- fully polished operator UX
- browser launch callback recovery

### `product/prd/007-inputs-and-edge-cases.md`

Status: in progress

Implemented:

- primary validation edge cases identified
- invalid export format handling exists
- missing client ID handling exists for token refresh on sync
- expired session refresh path exists

Not yet implemented:

- explicit retry UI
- callback network error handling

---

## TDD Coverage

### `engineering/tdd/001-architecture.md`

Status: in progress

Implemented:

- layered architecture documented
- module boundaries drafted
- package, CLI, domain, exporter, storage, OAuth files created

### `engineering/tdd/002-state-and-flow.md`

Status: in progress

Implemented:

- state flow model drafted
- CLI command dispatch validation paths in code
- login, sync, and export flows have real state transitions

### `engineering/tdd/003-ui-system.md`

Status: in progress

Implemented:

- CLI presentation guidance drafted
- terminal-facing status messaging helpers exist
- command success copy is polished for login, sync, and export
- OAuth callback recovery copy is clearer for state mismatch and missing code cases
- local dashboard command and browser UI expose cached bookmarks

### `engineering/tdd/004-validation-and-persistence.md`

Status: in progress

Implemented:

- validation and persistence boundaries drafted
- SQLite-backed session, export, and bookmark persistence exist
- command input validation exists in the scaffolded CLI

### `engineering/tdd/005-testing-strategy.md`

Status: in progress

Implemented:

- testing strategy prioritized
- unit tests cover exporter output, OAuth helpers, storage, CLI command validation
- integration-style tests cover sync and export flows with mocked X API responses

---

## Notes

- repo now has working implementation slices beyond scaffolding
- login still depends on live X credentials and authenticated callback flow
- `xport export` is now local-only and never talks to X
- update this file again when sync/export UX or token refresh ergonomics change materially

---

## Milestone Plan

### Milestone 1: Foundation Alignment

Goals:

- align repo guidance and product scope
- confirm naming and doc structure
- prepare repository implementation without scope drift

Status:

- completed

### Milestone 2: Core User Flow

Goals:

- implement `login`
- implement local storage export plumbing
- implement first working `export` path

Status:

- completed

### Milestone 3: First Serious UI Pass

Goals:

- finalize CLI presentation behavior
- standardize output and error formatting
- keep generated artifacts stable and readable

Status:

- in progress

### Milestone 4: Testing UX Hardening

Goals:

- add unit tests for export and auth logic
- add integration tests for file output and persistence
- harden command failures and edge cases

Status:

- pending

### Milestone 5: Product Polish

Goals:

- refine docs and CLI copy
- tighten file-path output ergonomics
- prepare release packaging and future integrations

Status:

- pending

---

## Roadmap Rules

- roadmap changes should follow PRD and TDD changes, not replace them
- completed milestones should be reflected in implementation status
## 2026-06-19 Next.js Dashboard Update

- the localhost dashboard now runs as a Next.js App Router app instead of the earlier custom Node HTTP server
- `npm run dev` serves the dashboard at `http://localhost:3000`
- the dashboard reads the same SQLite cache as the CLI and renders pulled bookmarks, saved session state, and export targets
- `/api/sync` and `/api/export` route handlers reuse the existing application and storage layers
- Markdown export now writes one file per bookmark inside a timestamped export directory; JSON and CSV remain single-file exports
- the shared TS source tree now uses bundler-safe extensionless imports; the CLI build rewrites emitted `dist/` imports to `.js` so Node ESM execution still works

Validation on 2026-06-19:

- `npm run build:web`
- `npm run build:cli`
- `npm run build`
- `npm test`
- `npm run lint`
