# X-Port V1 Kickoff

## Project Information

**Local Repository**

```text
/Users/sws/Development/tcv-labs/apps/x-port
```

**GitHub Repository**

```text
https://github.com/sspanogle/x-port.git
```

## Mission

Build X-Port, a local-first open-source utility that exports a user's personal X (Twitter) bookmarks into durable formats.

The project must:

- Use the official X API only
- Never scrape X pages or private endpoints
- Require users to provide their own X API credentials
- Store all data locally
- Export bookmarks to Markdown, JSON, and CSV
- Be designed for future integration with TCV Continuum
- Remain simple, understandable, and maintainable

## Architecture Principles

- TypeScript
- Node.js 22+
- Local-first
- No hosted backend
- No cloud database
- No telemetry
- No analytics
- No user account system
- No shared API keys
- User owns credentials and exported data

## Initial Technology Stack

- TypeScript
- Node.js
- Commander.js
- Zod
- SQLite
- Vitest
- ESLint
- Prettier

## Repository Structure

```text
x-port/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── docs/
├── examples/
├── src/
│   ├── commands/
│   ├── exporters/
│   ├── oauth/
│   ├── storage/
│   ├── x-api/
│   ├── types/
│   └── index.ts
├── tests/
├── exports/
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.js
└── .gitignore
```

## V1 Scope

Implement only the following functionality.

### Authentication

Command:

```bash
xport login
```

Requirements:

- OAuth 2.0 Authorization Code Flow with PKCE
- User supplies their own X credentials
- Access token stored locally
- Clear setup documentation
- No secrets committed to source control

### Export

Commands:

```bash
xport export --format md
xport export --format json
xport export --format csv
```

Exports should be written to:

```text
exports/
```

### Markdown Export

Each bookmark should include:

- Tweet text
- Author
- Tweet URL
- Tweet creation date
- Export timestamp

### JSON Export

Structured machine-readable export suitable for future processing.

### CSV Export

Spreadsheet-friendly export.

## Future Scope (Not Part of V1)

Do not implement:

- Browser extension
- Electron application
- Tauri application
- Hosted service
- Shared API infrastructure
- Continuum integration
- AI enrichment
- Semantic search
- Vector databases
- Incremental sync
- Scheduling
- Multi-platform export support
- Bookmark classification

Design the codebase so these features can be added later without major refactoring.

## AGENTS.md Requirements

Create an AGENTS.md containing guidance for contributors and AI coding agents.

Rules:

- Prefer small, reviewable commits
- Maintain strict TypeScript type safety
- Keep architecture local-first
- Use official X APIs only
- Never scrape X pages
- Never commit secrets
- Update documentation when behavior changes
- Add tests for business logic
- Favor simplicity over abstraction
- Preserve export format stability where possible

## Deliverables

Phase 1 should produce:

1. Project scaffold
2. README.md
3. AGENTS.md
4. TypeScript configuration
5. Linting and formatting setup
6. Test setup
7. CI workflow
8. CLI skeleton
9. OAuth implementation plan
10. Export pipeline design

## Development Philosophy

X-Port exists to help users preserve and own their knowledge outside closed platforms.

Core principles:

- User owns credentials
- User owns exported data
- Data remains portable
- Markdown is a first-class format
- Local-first by default
- Open source
- Durable outputs over platform dependence

Build a strong foundation first. Optimize for maintainability, clarity, and future extensibility rather than feature count.
