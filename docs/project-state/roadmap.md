# Roadmap

## Purpose

This document describes the current planned milestone sequence for `X-Port`.

It is not a release promise. It exists to help future sessions understand what should likely happen next.

---

## Current Phase

Foundation Alignment

Current project state:

- framework bootstrapped into the repo
- product scope captured in the kickoff and PRDs
- implementation work has not started yet

---

## Milestone Plan

### Milestone 1: Foundation Alignment

Goals:

- align repo guidance with the product scope
- confirm naming and doc structure
- prepare the repository for implementation without scope drift

Status:

- in progress

### Milestone 2: Core User Flow

Goals:

- implement `login`
- implement local storage and export plumbing
- implement the first working `export` path

Status:

- pending

### Milestone 3: First Serious UI Pass

Goals:

- finalize CLI presentation behavior
- standardize output and error formatting
- keep generated artifacts stable and readable

Status:

- pending

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
- tighten file-path and output ergonomics
- prepare for release packaging and future integrations

Status:

- pending

---

## Roadmap Rules

- roadmap changes should follow PRD and TDD changes, not replace them
- completed milestones should be reflected in implementation status
