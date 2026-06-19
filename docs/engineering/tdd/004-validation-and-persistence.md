# TDD 004: Validation and Persistence

## Purpose

Define how validation and local persistence should be handled for `X-Port`.

## Rules

- validate command inputs before side effects
- keep raw text, parsed values, and persisted records separate
- store credential and bookmark state locally
- abstract persistence behind a replaceable boundary
- persist only what the product needs for future exports and repeatable operation

## Validation Boundaries

- command-line arguments and flags
- OAuth callback and token exchange inputs
- API responses and pagination fields
- export format selection
- file paths and write destinations

## Persistence Boundaries

- SQLite for durable local state unless a later ADR changes the choice
- secure local storage for tokens and refresh data
- output files under the user-controlled export path
- no network-persistent application state

## Rules For Stored Data

- store stable identifiers for bookmarks rather than only rendered text
- keep timestamps and export metadata explicit
- do not over-normalize before the domain model is stable
- prefer schema-driven validation for persisted records

## Acceptance Criteria

- invalid input fails before writes occur
- local persistence can be read back deterministically
- export output can be produced from validated local data
