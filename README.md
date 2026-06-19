# X-Port

`X-Port` is a local-first tool for pulling your X bookmarks into local files you control.

Current v1 flow:

- log in with your own X developer app
- sync bookmarks into a local SQLite cache
- export bookmarks to Markdown, JSON, or CSV
- inspect and use everything locally through the Next.js dashboard

## Requirements

- Node.js `22+`
- an X developer app with OAuth 2.0 enabled
- your X app's OAuth 2.0 `Client ID`

This app does not use:

- consumer key
- consumer secret
- bearer token

It expects OAuth 2.0 user-context login.

## Install

```bash
npm install
```

Optional validation:

```bash
npm run build
npm test
```

## X App Setup

In the X developer portal, configure your app with:

- Callback URI / Redirect URL:
  - `http://127.0.0.1:8788/callback`
- Website URL:
  - any reasonable project or company URL

Important:

- the callback URL must match exactly
- `127.0.0.1` and `localhost` are not interchangeable here
- use the OAuth 2.0 `Client ID`, not the API key / consumer key

## Local Config

Create a local env file:

```bash
cp .env.example .env.local
```

Then set your real client id in `.env.local`:

```env
X_PORT_CLIENT_ID=your_real_client_id
X_PORT_REDIRECT_URI=http://127.0.0.1:8788/callback
```

Notes:

- `.env.local` is ignored by Git
- `.env.example` is safe to commit

## Run The App

Start the local dashboard:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## First-Run Flow

1. Click `Login with X`
2. Approve the OAuth flow in X
3. Return to the dashboard
4. Click `Sync bookmarks`
5. Choose an export format when ready

## Sync And Export Behavior

`Login with X`

- authenticates with your X account using OAuth 2.0 user context
- stores the session locally in the repo data directory

`Sync bookmarks`

- calls the X API
- may incur API costs
- writes pulled bookmarks into the local SQLite cache
- now shows a confirmation warning before continuing

`Export`

- reads only local cached data
- does not call the X API

Formats:

- Markdown:
  - writes one `.md` file per bookmark
  - places them in a timestamped export directory
- JSON:
  - writes one export file
- CSV:
  - writes one export file

Default local paths:

- cache / auth DB: `.x-port/`
- exports: `exports/`

Both are ignored by Git.

## CLI

The repo still includes the CLI entrypoints if you prefer terminal usage.

Useful commands:

```bash
npm run build:cli
node dist/index.js login
node dist/index.js sync
node dist/index.js export --format md
```

For most users, the dashboard is the easier path.

## Troubleshooting

Redirect mismatch

- confirm the X app callback URL is exactly:
  - `http://127.0.0.1:8788/callback`
- confirm `.env.local` uses the same exact value

Callback opens but login does not complete

- another local process may already be using the callback port
- this app currently expects `127.0.0.1:8788`

Unsupported authentication / 403 from bookmarks

- usually means the app is not using the OAuth 2.0 user-context flow correctly
- log in again with `Login with X`
- make sure you are using the OAuth 2.0 `Client ID`

No login button or stale UI

- restart `npm run dev`
- refresh the browser

## Safety Notes

- do not commit `.env.local`
- do not commit `.x-port/`
- do not commit `exports/`
- sync touches the X API
- export stays local-only
