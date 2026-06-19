# Session Handoffs

## Purpose

This directory contains concise session handoffs for future agents and maintainers.

Use handoffs when a session changes implementation, planning, architecture, or project direction enough that the next session needs continuity beyond the current state docs.

## Naming

Use this format:

```text
YYYY-MM-DD-short-title.md
```

Examples:

```text
2026-05-24-auth-foundation.md
2026-05-24-dashboard-ui-pass.md
```

## Template

```md
# Session Handoff: YYYY-MM-DD Short Title

## Closeout

- Closed At: YYYY-MM-DD h:mm AM/PM [TIMEZONE]
- Closed By: [USER_OR_OPERATOR]

## Summary

- [WHAT_CHANGED]

## Files Changed

- `[FILE_PATH]`: [WHY_IT_CHANGED]

## Decisions Made

- [DECISION_OR_NONE]

## Validation

- [CHECK_OR_TEST_RUN]

## Open Questions

- [QUESTION_OR_NONE]

## Next Suggested Step

- [NEXT_STEP]
```

## Rules

- Keep handoffs factual and brief.
- Include closeout date and time in 12-hour format, using the local/project timezone when known.
- Include the user or operator who requested or performed the session closeout.
- Link to PRDs, TDDs, ADRs, or implementation status when relevant.
- Do not duplicate the full implementation status document.
- Do not include secrets, credentials, tokens, private keys, `.env` values, or local-only private data.
- Prefer updating `../implementation-status.md` for durable state and writing a handoff for session continuity.
