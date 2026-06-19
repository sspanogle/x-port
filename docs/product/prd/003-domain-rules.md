# PRD 003: Domain Rules

## Purpose

Define the product-level domain rules and calculation assumptions for `X-Port`.

## Core Domain Model

- `bookmark`: a saved X post with stable identity and exportable fields
- `export run`: one execution of the export command
- `credential set`: the local OAuth state used to access the API
- `export set`: the collection of generated files from one run

## Domain Rules

- a bookmark should be identified by its stable X identifier
- export output should be derived from local state plus current API fetches
- exports should preserve the source bookmark text, author, URL, and timestamp fields when available
- repeated export runs should not change the meaning of stored local records
- the domain should not know about terminal styling or command parsing

## Acceptance Criteria

- domain objects and rules are named consistently across docs and code
- the product model is stable enough to support Markdown, JSON, and CSV exports
- local state remains separable from presentation concerns
