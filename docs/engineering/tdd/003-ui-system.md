# TDD 003: UI System

## Purpose

Define how the presentation layer should be implemented so the CLI remains understandable and maintainable.

## Theme Architecture

Recommended output and formatting modules:

- `src/presentation/output-format.ts`
- `src/presentation/status.ts`
- `src/presentation/tables.ts`
- `src/presentation/errors.ts`
- `src/presentation/prompts.ts`

## Responsive Strategy

- respect terminal width and fallback gracefully when columns are narrow
- prefer single-column summaries when layout is constrained
- keep generated Markdown and CSV formatting stable and explicit

## CLI Presentation Rules

- use concise, predictable status lines
- show exact file destinations for generated exports
- surface API or auth errors with enough detail to act on them
- avoid decorative noise in successful output
- keep prompt text and confirmation text direct

## Future UI Notes

If a future UI layer is introduced, it should reuse the same output semantics and terminology rather than inventing new ones.

## Acceptance Criteria

- command output is readable in a terminal first
- generated export formatting stays stable across runs
- presentation code remains separate from domain logic
## 2026-06-19 Update

The current V1 UI surface is a localhost-only Next.js dashboard.

It is intentionally operator-facing and utility-first:

- status panel for data directory, export directory, saved session, and cached bookmark count
- bookmark list pulled from the same SQLite cache used by CLI commands
- direct local actions for sync and export

This remains a local-first shell. It does not introduce any hosted service, multi-user state, or cloud dependency.
