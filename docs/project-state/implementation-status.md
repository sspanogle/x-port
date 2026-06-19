# Implementation Status

## Purpose

Track how the current codebase maps to the PRDs and TDDs.

This document is the working status layer between:

- product intent in `docs/product/prd/`
- technical guardrails in `docs/engineering/tdd/`
- actual implemented code in the repository

It should be updated when meaningful implementation milestones land.

---

## Current Summary

Current application status:

- framework bootstrapped into the repository
- product and technical docs are seeded with X-Port scope
- initial CLI/package scaffold is in place
- local SQLite persistence is implemented
- OAuth PKCE helpers and X API wiring are implemented
- export commands can fetch bookmarks and write Markdown, JSON, and CSV files locally

---

## PRD Coverage

### `product/prd/001-product-foundation.md`

Status: in progress
Implemented:

- project scope and local-first guardrails
- CLI/package scaffold
- pure export formatter layer
- local persistence layer

Not yet implemented:

- user-facing success messaging polish
- broader configuration ergonomics

### `product/prd/002-mvp-experience.md`

Status: in progress
Implemented:

- `xport login` command shell
- `xport export --format` command shell
- login flow persists OAuth session and authenticated user identity
- export flow reads stored session and writes local files

Not yet implemented:

- browserless auth fallback
- richer success/error copy

### `product/prd/003-domain-rules.md`

Status: in progress
Implemented:

- domain vocabulary drafted
- bookmark and export types
- bookmark fetch mapping from X API responses
- export record persistence

Deferred design:

- persistence schema details beyond the current MVP

### `product/prd/004-platform-and-accessibility.md`

Status: in progress
Implemented:

- local-first platform direction defined
- Node.js CLI scaffold with terminal-first output
- stable exit codes and explicit file output messages

Not yet implemented:

- accessibility review of broader command copy

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
- login and export command paths are in code
- export flow supports local refresh and local file output

Not yet implemented:

- fully polished operator UX for browser launch and callback recovery

### `product/prd/007-inputs-and-edge-cases.md`

Status: in progress
Implemented:

- primary validation and edge cases identified
- invalid export format handling exists
- missing client ID handling exists
- expired session refresh path exists

Not yet implemented:

- explicit retry UI for callback and network errors

---

## TDD Coverage

### `engineering/tdd/001-architecture.md`

Status: in progress
Implemented:

- layered architecture documented
- module boundaries drafted
- package, CLI, domain, exporter, storage, and OAuth files created

### `engineering/tdd/002-state-and-flow.md`

Status: in progress
Implemented:

- state and flow model drafted
- CLI command dispatch and validation paths are in code
- login and export flows have real state transitions

### `engineering/tdd/003-ui-system.md`

Status: in progress
Implemented:

- CLI presentation guidance drafted
- terminal-facing status messaging helpers exist

### `engineering/tdd/004-validation-and-persistence.md`

Status: in progress
Implemented:

- validation and persistence boundaries drafted
- SQLite-backed session and export persistence exist
- command input validation exists for the scaffolded CLI

### `engineering/tdd/005-testing-strategy.md`

Status: in progress
Implemented:

- testing strategy prioritized
- unit tests cover exporter output, OAuth helpers, storage, and CLI command validation
- integration-style tests cover export flow with mocked X API responses

---

## Notes

- the repo now has a working implementation slice beyond scaffolding
- login still depends on live X credentials and an authenticated callback flow
- update this file again when the auth callback UX or export formatting rules change materially
