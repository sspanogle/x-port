# TDD 002: State and Flow

## Purpose

Define how application state and user-flow state should be modeled for `X-Port`.

## Recommended Direction

- keep raw CLI input separate from validated command options
- keep auth state separate from export state
- model the local store as the durable source of truth
- make pagination, timestamps, and retry behavior injectable for tests

## Flow Model

The expected top-level flows are:

1. `login`
2. `export`
3. `export` after prior login
4. error recovery and retry after validation or network failures

State should progress through:

- raw input
- validated input
- authenticated or unauthenticated status
- fetched bookmark data
- exported output files
- terminal summary or error state

## Rules

- do not rely on hidden mutable globals for command state
- do not collapse raw, parsed, and persisted data into one structure
- keep export runs deterministic from local data and current inputs

## Acceptance Criteria

- login and export flows have explicit state transitions
- validation failures do not leak into persisted state
- export output can be regenerated from local state and input alone
