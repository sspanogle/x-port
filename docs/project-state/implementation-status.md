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
- initial CLI/package scaffold and pure export formatters are implemented
- OAuth, persistence, and real X API integration are still pending

---

## PRD Coverage

### `product/prd/001-product-foundation.md`

Status: in progress
Implemented:

- framework and kickoff alignment
- initial CLI/package scaffold
- pure export formatter layer

Not yet implemented:

- login flow
- export pipeline
- local persistence

### `product/prd/002-mvp-experience.md`

Status: in progress
Implemented:

- command names and core flow defined in docs
- `xport login` and `xport export --format` command shells
- basic command validation and help output

Not yet implemented:

- auth and export execution

### `product/prd/003-domain-rules.md`

Status: in progress
Implemented:

- domain vocabulary drafted
- bookmark and export types
- pure export formatter layer

Deferred design:

- persistence schema details

### `product/prd/004-platform-and-accessibility.md`

Status: in progress
Implemented:

- local-first platform direction defined
- Node.js CLI scaffold with terminal-first output

Not yet implemented:

- operational command behavior

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
- command shells and validation paths exist

Not yet implemented:

- executable flow implementation

### `product/prd/007-inputs-and-edge-cases.md`

Status: in progress
Implemented:

- primary validation and edge cases identified
- invalid export format handling exists

Not yet implemented:

- input handling for OAuth and persistence flows

---

## TDD Coverage

### `engineering/tdd/001-architecture.md`

Status: in progress
Implemented:

- layered architecture documented
- module boundaries drafted
- package, CLI, domain, and exporter files created

### `engineering/tdd/002-state-and-flow.md`

Status: in progress
Implemented:

- state and flow model drafted
- CLI command dispatch and validation paths are in code

### `engineering/tdd/003-ui-system.md`

Status: in progress
Implemented:

- CLI presentation guidance drafted
- terminal-facing status messaging helpers exist

### `engineering/tdd/004-validation-and-persistence.md`

Status: in progress
Implemented:

- validation and persistence boundaries drafted
- command input validation exists for the scaffolded CLI

### `engineering/tdd/005-testing-strategy.md`

Status: in progress
Implemented:

- testing strategy prioritized
- unit tests cover exporter output and CLI command validation

---

## Notes

- repository now has a working scaffold and pure export formatters
- login, X API access, and persistence still need implementation
- update this file again when the storage and real export pipeline land
