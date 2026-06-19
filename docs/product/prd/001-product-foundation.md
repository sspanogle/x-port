# PRD 001: Product Foundation

## Purpose

Define the core product problem, target user, and MVP scope for `X-Port`.

## Audience

- people who want to preserve their own X bookmarks in local durable formats
- developers or power users who prefer a local-first CLI over a hosted app

## Problem Statement

X bookmarks are useful but not durable on their own.
Users need a local-first way to export their bookmarks into formats they can keep, inspect, and reuse without depending on a hosted service.

## Product Promise

`X-Port` lets a user authenticate with their own X credentials and export bookmarks into Markdown, JSON, and CSV without scraping, shared accounts, or a hosted backend.

## Must

- use official X APIs only
- store credentials and export state locally
- export bookmarks to Markdown, JSON, and CSV
- keep all user data under user control
- remain understandable and maintainable
- avoid scraping and private endpoints

## Should

- make the CLI easy to run repeatedly
- make export output deterministic and stable
- keep the initial implementation simple enough to extend later
- integrate cleanly with future TCV Continuum workflows where useful

## Won't

- hosted backend
- shared API keys
- cloud database
- browser extension
- desktop wrapper
- AI enrichment or classification in V1

## Success Criteria

- a user can log in with their own X credentials
- a user can export bookmarks to the supported local formats
- exported files are written to the local filesystem
- the repo documents the current implementation status clearly

## Acceptance Criteria

- the product can be understood as a local bookmark export utility from the repo docs alone
- the scope stays bounded to the official API and local data
- V1 deliverables can be built without adding an external service

## Open Questions

- which local storage details should be optimized first for token safety
- whether exported Markdown should prioritize readability or strict machine round-tripping when they conflict
