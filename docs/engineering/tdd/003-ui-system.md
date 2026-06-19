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
