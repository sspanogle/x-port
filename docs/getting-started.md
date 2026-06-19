# Getting Started

## Purpose

This is the shortest path for starting work in `X-Port`.

Use it when you are picking up the repo for the first time, resuming after a pause, or starting a new implementation pass.

---

## Current State

- framework docs are bootstrapped
- the repo is still at docs-first stage
- no application code has been implemented yet
- the kickoff file lives at `x-port-v1-kickoff.md`

---

## First Decisions To Make

Before coding, make sure these are concrete:

1. target user
2. core problem the product solves
3. MVP scope
4. what is explicitly out of scope
5. local storage and export boundaries
6. failure and recovery behavior

You do not need perfect answers yet.
You do need a usable first pass.

---

## Recommended Setup Path

### If you are starting from this repo

1. read `docs/README.md`
2. read `docs/terminology.md`
3. read the product PRDs in order
4. read the TDDs in order
5. read `docs/project-state/implementation-status.md`
6. read `docs/project-state/roadmap.md`

### If you are continuing implementation

1. read the latest handoff under `docs/project-state/handoffs/`
2. re-check `docs/project-state/implementation-status.md`
3. re-read any PRDs or TDDs touched by the next change
4. update the project-state docs after meaningful progress

---

## Fill These Documents First

1. `docs/terminology.md`
2. `docs/product/prd/001-product-foundation.md`
3. `docs/product/prd/002-mvp-experience.md`
4. `docs/product/prd/003-domain-rules.md`
5. `docs/engineering/tdd/001-architecture.md`
6. `docs/engineering/tdd/002-state-and-flow.md`
7. `docs/engineering/tdd/004-validation-and-persistence.md`
8. `docs/project-state/implementation-status.md`
9. `docs/project-state/roadmap.md`

Once those are in place, implement the CLI scaffold and keep the status docs aligned with the code.

---

## How To Use In Work Sessions

### Product work

Read the PRDs, terminology, and project-state docs before changing product behavior.

### Engineering work

Read the relevant PRDs, TDDs, implementation status, and recent handoffs before coding.

### UI or presentation work

For `X-Port`, this usually means CLI presentation and generated output formatting.
Read `design/ui-direction.md`, `design/design-system.md`, and the relevant PRDs/TDDs first.

---

## When To Write The First ADR

Do not write an ADR immediately.

Write the first ADR only when a decision will materially affect future engineering work, for example:

- architecture layering
- state-management direction
- persistence boundary design
- testing strategy that changes code structure
- output-formatting policy that future code depends on

Do not write ADRs for:

- first-pass product copy
- routine formatting
- minor refactors
- small test additions

---

## Ongoing Rule

As implementation progresses:

- update `docs/project-state/implementation-status.md` when code meaningfully moves
- update PRDs when product behavior changes
- update TDDs when technical direction changes
- update roadmap when milestone status changes
- add handoffs when future sessions need concise continuity context
- add ADRs only for real architectural decisions
