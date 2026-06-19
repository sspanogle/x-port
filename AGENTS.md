# AGENTS.md

## Purpose

This document routes AI coding agents for the `X-Port` repository.
It is a control document, not the product spec.
Detailed product, engineering, and project-state decisions live under `docs/`.

---

## Source Truth

For meaningful work, read and follow repository docs in this order:

1. `docs/product/prd/`
2. `docs/engineering/tdd/README.md`
3. `docs/design/ui-direction.md`
4. `docs/design/design-system.md`
5. `docs/project-state/implementation-status.md`
6. recent handoffs in `docs/project-state/handoffs/`

If a higher-level doc conflicts with a more specific doc, update the more specific source of truth.

---

## Project Overview

`X-Port` is a local-first CLI for people who want to export their X bookmarks into durable formats.

MVP focuses on:

- OAuth login using official X APIs only
- local bookmark export to Markdown, JSON, and CSV
- local storage for credentials and export state

Non-goals for V1:

- scraping X pages or private endpoints
- hosted backend or shared API keys
- cloud database, telemetry, analytics, or user accounts
- browser extension, desktop wrapper, or other platform expansion

---

## Documentation Discipline

Keep the docs aligned with implementation as it changes.

Required rules:

- when implementation meaningfully changes, update `docs/project-state/implementation-status.md`
- when product behavior changes, update the relevant PRD
- when technical direction changes, update the relevant TDD
- when a session leaves important continuity context, add a concise handoff under `docs/project-state/handoffs/`
- add an ADR only for a real architectural or structural decision
- do not create ADRs for routine polish, small refactors, or minor test additions

`docs/project-state/implementation-status.md` should reflect what is actually built.
`docs/project-state/handoffs/` should stay concise, factual, and session-oriented.

---

## Architectural Rules

### 1. Keep Layers Separate

Prefer a simple layered split:

- `domain`: bookmark, export, and credential rules
- `application`: commands, orchestration, validation, persistence coordination
- `presentation`: CLI output, prompts, formatting, and any future UI shells

### 2. Keep Core Logic Deterministic

Core export and transformation behavior should be derived from local state and inputs, not hidden mutable globals.

### 3. Prefer Simple State First

Start with the lightest state model that remains testable.
Do not introduce heavier frameworks until they solve a real problem.

### 4. Preserve Local-First Boundaries

All durable data should remain under local control.
Never add a cloud dependency unless the PRD and TDDs are updated first.

---

## Testing Requirements

Maintain a practical automated test base with emphasis on:

- unit tests for domain and export logic
- unit tests for command orchestration and state transitions
- validation tests for input parsing and edge cases
- integration coverage for the CLI and local persistence path

Cover the highest-risk behavior first:

- login flow
- export correctness
- output stability
- local persistence safety

---

## Non-Goals

Do not implement out-of-scope features without updating the PRDs first.
Do not silently widen scope.
Keep the repo focused on local bookmark export and durability.
