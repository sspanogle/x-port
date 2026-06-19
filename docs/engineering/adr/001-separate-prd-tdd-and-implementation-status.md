# Title

Separate PRDs, TDDs, and Implementation Status

## Status

Accepted

## Context

Many project repositories collapse product requirements, technical direction, implementation notes, and status tracking into a small number of broad documents.

That tends to create predictable failure modes:

- product behavior and implementation details get mixed together
- status notes become stale because they live inside source-of-truth docs
- agents and humans cannot tell whether a document describes intent or current reality
- implementation work drifts because the repo lacks a clean status layer

This framework is specifically intended for iterative AI-assisted software development, where that ambiguity causes repeated mistakes across sessions.

## Decision

The framework separates these concerns into distinct layers:

- PRDs define product behavior and scope
- TDDs define implementation direction and technical guardrails
- `project-state/implementation-status.md` tracks what is actually built right now
- ADRs capture the why behind real architectural decisions

`project-state/implementation-status.md` is a required bridge layer between specifications and code.
It is not optional project reporting.

## Consequences

Positive consequences:

- agents can distinguish between target state and current state
- product changes and implementation changes can be tracked independently
- status can be updated frequently without polluting source-of-truth requirements
- future sessions have a cleaner entry point into a project

Tradeoffs:

- there are more documents to maintain
- maintainers must enforce discipline so the status layer stays current

## Alternatives Considered

### Single product/engineering spec document

Rejected because it causes intent, status, and design rationale to blur together.

### PRDs and TDDs only, no implementation-status layer

Rejected because there is no reliable place to record what has actually landed without distorting the source-of-truth docs.
