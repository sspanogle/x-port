# PRD 006: User Flows

## Purpose

Define the important user flows for `X-Port`.

## Core Flows

### Login Flow

1. user runs `xport login`
2. CLI validates the command and required configuration
3. user completes the X OAuth flow
4. the local credential set is stored
5. CLI confirms success or explains the failure

### Export Flow

1. user runs `xport export --format <format>`
2. CLI validates the requested format and local state
3. tool fetches bookmarks from X
4. tool writes the export files locally
5. CLI reports the output path and summary

### Re-Export Flow

1. user runs export again in a different format
2. tool reuses local credentials and state
3. output is written without reconfiguring the product

### Recovery Flow

1. login or export fails
2. CLI reports the reason in plain language
3. user corrects the issue
4. user retries the command

## Acceptance Criteria

- the major command flows are documented before implementation
- each flow has a clear success and failure path
- no flow depends on a hosted service
