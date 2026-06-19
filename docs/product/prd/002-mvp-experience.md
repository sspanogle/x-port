# PRD 002: MVP Experience

## Purpose

Define the primary MVP user experience for `X-Port`.

## Primary Flow

1. user runs `xport login`
2. user completes OAuth with their own X credentials
3. user runs `xport export --format md`
4. the tool writes the export to the local filesystem and reports success
5. the user can repeat the export in JSON or CSV format without changing the product model

## Experience Goals

- the first successful run should be clear and low-friction
- success output should show where files were written
- failures should explain what happened and what to try next
- the CLI should feel like a dependable utility, not an interactive app

## Secondary Behaviors

- show a clear empty-state message when there are no bookmarks
- preserve stable file naming and output locations
- keep repeated runs predictable

## Acceptance Criteria

- a new user can understand the main flow from the docs and command names
- login and export each have a straightforward terminal path
- the MVP does not depend on any hosted service
