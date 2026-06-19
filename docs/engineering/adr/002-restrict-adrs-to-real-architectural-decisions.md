# Title

Restrict ADRs to Real Architectural Decisions

## Status

Accepted

## Context

Teams and AI agents often overproduce decision records once ADRs exist.
That reduces signal quality quickly.

In AI-assisted workflows, the risk is higher because an agent can easily create an ADR for every non-trivial change unless constrained explicitly.

If that happens, the ADR layer becomes noisy and stops being useful.

## Decision

This framework restricts ADR creation to real architectural or structural decisions that materially affect future engineering work.

ADRs should be created for decisions such as:

- architectural layering
- state-management approach
- persistence boundaries
- testing structure that changes code design
- major theming or system-structure decisions
- integration patterns with lasting consequences

ADRs should not be created for:

- routine UI polish
- wording cleanup
- minor refactors
- small test additions
- ordinary implementation progress

## Consequences

Positive consequences:

- ADRs remain high-signal and useful
- future sessions can trust that an ADR indicates a meaningful decision
- maintainers spend less time curating low-value decision records

Tradeoffs:

- teams must use judgment when a change sits near the boundary
- some decisions may remain documented only in TDD updates rather than ADR form

## Alternatives Considered

### Record every meaningful change as an ADR

Rejected because it creates documentation noise and reduces the value of the ADR set.

### Do not use ADRs at all

Rejected because architectural rationale still needs a durable home separate from PRDs and TDDs.
