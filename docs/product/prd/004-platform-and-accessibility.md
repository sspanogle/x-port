# PRD 004: Platform and Accessibility

## Purpose

Define platform and accessibility expectations for `X-Port`.

## Platform Direction

- primary platform: local command line on Node.js 22+
- operating model: local-first and offline-friendly once credentials are stored
- data boundaries: local filesystem and local database only

## Accessibility Expectations

- CLI messages should be concise and clear
- errors should name the failing command, resource, or path
- output should remain legible in plain terminals without color
- if color or emphasis is used, the meaning must not depend on it alone

## Operational Expectations

- support common terminal widths without breaking output readability
- provide stable exit codes for success and failure
- avoid hidden background work that users cannot observe

## Acceptance Criteria

- the product can be used effectively from a plain terminal
- accessibility does not depend on a graphical UI
- output remains understandable when copied into logs or issue reports
