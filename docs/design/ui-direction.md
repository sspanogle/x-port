# UI Direction

## Purpose

Describe how `X-Port` should feel, what emotional response it should create, and what presentation directions are in or out of bounds.

For this repo, "UI" primarily means CLI presentation and generated document formatting.

---

## Product Feel

The product should feel:

- calm
- dependable
- plainspoken

The product should not feel:

- flashy
- cluttered
- opaque

---

## Audience

Primary audience:

- people exporting their own X bookmarks into durable local formats

Desired first impression:

- this is a serious, local-first utility that will not surprise you with hidden network or data behavior

---

## Visual Direction

Reference qualities to emulate:

- terminal tools that value compact layout and clear status messages: precision
- archival or backup utilities: trustworthiness
- well-structured technical docs: clarity

Visual identity direction:

- simple, information-dense, and restrained
- prioritize legibility over decoration
- use hierarchy only where it improves task completion

Platform philosophy:

- one shared product identity
- platform-adaptive details where appropriate
- for CLI output, optimize for scanability and predictable status lines

---

## Interaction Direction

Primary hierarchy:

- successful completion and file destination
- clear error reporting and next action guidance
- optional detail and debug output

Copy style:

- short, concrete, and direct
- prefer exact file paths and explicit commands
- avoid marketing language

Motion style:

- no decorative motion in V1
- if a future UI adds motion, keep it functional and subtle

---

## Notes For Future Sessions

Before making meaningful UI changes:

- read this file
- read `design/design-system.md`
- read the relevant PRDs and TDDs
- keep CLI output stable unless the PRD says otherwise
