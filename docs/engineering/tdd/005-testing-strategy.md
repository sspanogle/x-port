# TDD 005: Testing Strategy

## Purpose

Define the testing strategy for `X-Port`.

## Recommended Test Layers

- unit tests for domain rules and export formatting
- unit tests for command orchestration and state transitions
- validation tests for CLI input and schema handling
- integration tests for local persistence and file output
- CLI smoke tests for the login and export paths

## Priorities

- test correctness-critical first
- test user-visible risky flows second
- test polish-level behavior later

## High-Risk Areas

- OAuth flow handling
- export content correctness
- file-writing behavior
- pagination and empty-state handling
- output stability across repeated runs

## Acceptance Criteria

- core business rules are covered by unit tests
- CLI flows have at least one end-to-end smoke path
- regressions in export format or persistence are detectable
