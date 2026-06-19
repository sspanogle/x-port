# Docs Index

## Purpose

This directory contains the source-of-truth docs for `X-Port`.
Use these files before making product, engineering, design, or project-state changes.

---

## Reading Order

For general orientation, read in this order:

1. `getting-started.md`
2. `terminology.md`
3. `product/prd/001-product-foundation.md`
4. `product/prd/002-mvp-experience.md`
5. `engineering/tdd/README.md`
6. `engineering/adr/README.md`
7. `design/ui-direction.md`
8. `design/design-system.md`
9. `project-state/implementation-status.md`
10. `project-state/roadmap.md`
11. `project-state/handoffs/README.md`

---

## Directory Guide

### `getting-started.md`

Fast path for starting a new session or a new implementation pass.

### `terminology.md`

Canonical product language. Keep naming and copy aligned here.

### `product/prd/`

Product requirements. They define what `X-Port` must do and what stays out of scope.

### `engineering/tdd/`

Technical design docs. They define how the product should be implemented.

### `design/ui-direction.md`

Product feel and interface direction. For `X-Port`, this is primarily terminal and docs presentation.

### `design/design-system.md`

Reusable visual rules and formatting patterns.

### `engineering/adr/`

Architecture decision records. Add these only for decisions that change future engineering direction.

### `project-state/implementation-status.md`

Current implementation reality versus the PRDs and TDDs.

### `project-state/roadmap.md`

Current milestone sequence and next likely work.

### `project-state/handoffs/`

Concise session handoffs with closeout metadata and next-step context.

---

## Maintenance Rules

- prefer specific docs over generic guidance when there is a conflict
- update `AGENTS.md` if this index or the specific docs drift
- correct stale documents instead of leaving them ambiguous
