# Terminology

## Purpose

Define canonical product and engineering language for `X-Port`.

Use this document to prevent the product, docs, code, and presentation from drifting into inconsistent naming.

---

## Product Terms

- `bookmark`: a saved X post the user wants to preserve locally
- `export run`: one invocation of the export command
- `export set`: the generated files produced by one export run
- `credential set`: locally stored OAuth material used to access the user's X account
- `archive`: the local collection of saved bookmarks and export outputs

---

## UX Terms

- `login`: the OAuth command that connects X credentials locally
- `export`: the command that writes bookmark data to disk
- `format`: one of the supported output types, currently `md`, `json`, or `csv`
- `empty state`: the condition where there are no bookmarks available to export
- `error state`: the condition where login, fetch, validation, or file writing fails

---

## Engineering Terms

- `domain`: pure models, rules, and calculations
- `application`: state, orchestration, validation, controllers
- `presentation`: CLI output, formatting, prompts, and any future UI shells
- `local store`: SQLite database or file-backed persistence under user control
- `official API`: the documented X API surface only

---

## Naming Rules

- prefer one canonical term per concept
- use `bookmark` for the data object and `export run` for the command execution
- keep local-only concepts named as local-only concepts
- update this file when terminology intentionally changes
- avoid using different labels for the same concept across docs and code
