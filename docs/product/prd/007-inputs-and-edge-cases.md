# PRD 007: Inputs and Edge Cases

## Purpose

Define input behavior, validation expectations, and important edge cases for `X-Port`.

## Input Rules

- `login` takes no user content beyond configuration and OAuth callback data
- `export` must require a supported format
- format values should be validated before any output is written
- file paths should be validated before file creation or overwrite

## Important Edge Cases

- no bookmarks available
- expired or revoked credentials
- network failure during API access
- API pagination returning many pages
- malformed API response data
- repeated bookmarks or duplicate identifiers
- unwritable output directory
- unsupported export format
- partial write failure after output creation has started

## Validation Expectations

- reject invalid input before side effects
- provide actionable error messages
- preserve local data on validation failure

## Acceptance Criteria

- the edge cases most likely to affect data integrity are identified before coding
- validation behavior is explicit and testable
- commands fail safely when the environment is not ready
