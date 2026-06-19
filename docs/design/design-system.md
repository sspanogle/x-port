# Design System

## Purpose

Define reusable visual rules for `X-Port` so presentation implementation can remain coherent over time.

This document should translate visual direction into reusable tokens, patterns, and component constraints.

---

## System Strategy

Recommended model:

- product design system: custom `X-Port` terminal and document presentation system
- implementation base: Node.js CLI output and Markdown/CSV/JSON emitters
- platform adaptation: respect terminal width and platform path conventions where needed

---

## Token Categories

Define and centralize tokens for:

- typography for headings, labels, and status output
- spacing for terminal output and document layout
- layout for tables, summaries, and warnings
- motion only if a future UI layer requires it

---

## Color Roles

For terminal output or future UI layers, document semantic roles instead of screen-specific colors, for example:

- neutral
- muted
- accent
- success
- warning
- destructive

---

## Typography Roles

Document at minimum:

- title
- body
- label
- status
- code or path emphasis
- numeric emphasis if relevant

---

## Component Rules

Document expectations for key components such as:

- command summaries
- prompt and confirmation output
- export result panels or tables
- warnings and validation states
- file path display

---

## Formatting Rules

Document display rules for important values such as:

- timestamps
- counts
- file sizes if reported
- file paths
- export format names

---

## Maintenance Rule

Keep this document focused on reusable system rules.
Do not turn it into a backlog or product spec.
