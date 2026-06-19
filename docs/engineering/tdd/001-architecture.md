# TDD 001: Architecture

## Purpose

Define the intended implementation architecture for `X-Port`.

## Layering Direction

- `domain`: bookmark rules, export rules, and value objects
- `application`: commands, orchestration, validation, persistence coordination
- `presentation`: CLI output, prompts, progress, and formatting

## Intended Modules

- `src/commands/`: `login`, `export`, and future command entry points
- `src/oauth/`: OAuth flow handling and token exchange
- `src/storage/`: SQLite access and local persistence boundaries
- `src/x-api/`: X API clients and request shaping
- `src/exporters/`: Markdown, JSON, and CSV output writers
- `src/types/`: shared types and schema-derived shapes
- `src/index.ts`: command wiring and process entry

## Rules

- keep dependencies flowing inward
- keep domain logic testable in isolation
- keep API integration behind a narrow boundary
- keep CLI orchestration thin
- keep all durable data local

## Constraints

- official X APIs only
- no scraping of X pages or private endpoints
- no hosted backend
- no shared API keys
- no telemetry or analytics

## Acceptance Criteria

- the codebase has a clear command, application, and domain separation
- OAuth and export code can be tested without the CLI entry point
- API calls can be mocked at a narrow boundary
