# Roadmap

## Purpose

This document describes the current planned milestone sequence for `X-Port`. It is not a release promise. It exists to help future sessions understand what should likely happen next.

---

## Current Phase

First Serious UI Pass

Current project state:

- framework bootstrapped into the repo
- product scope captured in the kickoff PRDs
- login, persistence, and bookmark sync/export plumbing are implemented
- callback UX, token refresh ergonomics, and output polishing still need work

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
