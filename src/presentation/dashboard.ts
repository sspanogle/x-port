import type { Bookmark } from "../domain/bookmark";
import type { StoredSession } from "../storage/database";

export interface DashboardPageModel {
  title: string;
  serverUrl: string;
  dataDir: string;
  exportDir: string;
  session: StoredSession | undefined;
  bookmarks: Bookmark[];
  notice: string | undefined;
  error: string | undefined;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function renderArticle(article: Record<string, unknown>): string {
  const title = typeof article.title === "string" ? article.title : undefined;
  const text = typeof article.text === "string" ? article.text : undefined;
  const raw = escapeHtml(JSON.stringify(article, null, 2));

  return `
    <section class="article">
      <h4>Article</h4>
      ${title ? `<p><strong>Title:</strong> ${escapeHtml(title)}</p>` : ""}
      ${text ? `<p><strong>Body:</strong> ${escapeHtml(text)}</p>` : ""}
      <details>
        <summary>Raw article metadata</summary>
        <pre>${raw}</pre>
      </details>
    </section>
  `;
}

function renderBookmark(bookmark: Bookmark): string {
  const summary = bookmark.fullText ?? bookmark.text;
  const article = bookmark.article ? renderArticle(bookmark.article) : "";

  return `
    <article class="bookmark">
      <div class="bookmark-head">
        <div>
          <h3>${escapeHtml(bookmark.text)}</h3>
          <p class="meta">
            ${escapeHtml(bookmark.authorName)} @${escapeHtml(bookmark.authorHandle)}
            · ${escapeHtml(formatDateTime(bookmark.createdAt))}
          </p>
        </div>
        <a class="link" href="${escapeHtml(bookmark.url)}" target="_blank" rel="noreferrer">
          Open post
        </a>
      </div>
      <p class="body">${escapeHtml(summary)}</p>
      ${article}
    </article>
  `;
}

function renderNotice(notice: string | undefined): string {
  if (!notice) {
    return "";
  }

  return `<div class="banner banner-notice">${escapeHtml(notice)}</div>`;
}

function renderError(error: string | undefined): string {
  if (!error) {
    return "";
  }

  return `<div class="banner banner-error">${escapeHtml(error)}</div>`;
}

export function renderDashboardPage(model: DashboardPageModel): string {
  const bookmarkCount = model.bookmarks.length;
  const sessionSummary = model.session
    ? `Connected as @${escapeHtml(model.session.username)} (${escapeHtml(model.session.userId)})`
    : "No saved session. Run `xport login` in the terminal first.";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(model.title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f1ea;
        --panel: #ffffff;
        --text: #172033;
        --muted: #5d677a;
        --border: #d7d2c8;
        --accent: #1947a3;
        --accent-soft: #dce7ff;
        --notice: #0f5132;
        --notice-bg: #d1f2e0;
        --error: #842029;
        --error-bg: #f9d6d5;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, "Segoe UI", system-ui, -apple-system, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, #fff9ed 0, transparent 28rem),
          linear-gradient(180deg, #fbfaf7 0%, var(--bg) 100%);
      }

      .shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px 20px 56px;
      }

      header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: start;
        margin-bottom: 24px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: clamp(2rem, 4vw, 3.5rem);
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .lede {
        margin: 0;
        color: var(--muted);
        max-width: 68ch;
      }

      .status-panel {
        min-width: 300px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: rgba(255,255,255,0.84);
        padding: 18px;
        box-shadow: 0 16px 40px rgba(21, 32, 51, 0.08);
      }

      .status-panel dt {
        color: var(--muted);
        font-size: 0.9rem;
        margin-top: 12px;
      }

      .status-panel dd {
        margin: 4px 0 0;
        font-weight: 600;
      }

      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 20px 0 24px;
      }

      form {
        margin: 0;
      }

      button, .button {
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        background: var(--accent);
        color: #fff;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      button.secondary, .button.secondary {
        background: var(--accent-soft);
        color: var(--accent);
      }

      .banner {
        border-radius: 14px;
        padding: 14px 16px;
        margin-bottom: 16px;
        border: 1px solid transparent;
      }

      .banner-notice {
        background: var(--notice-bg);
        color: var(--notice);
        border-color: rgba(15, 81, 50, 0.18);
      }

      .banner-error {
        background: var(--error-bg);
        color: var(--error);
        border-color: rgba(132, 32, 41, 0.18);
      }

      .section-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 16px;
        margin: 28px 0 12px;
      }

      .section-head h2 {
        margin: 0;
        font-size: 1.2rem;
      }

      .section-head p {
        margin: 0;
        color: var(--muted);
      }

      .bookmarks {
        display: grid;
        gap: 16px;
      }

      .bookmark {
        border: 1px solid var(--border);
        border-radius: 20px;
        background: rgba(255,255,255,0.9);
        padding: 18px;
        box-shadow: 0 12px 30px rgba(21, 32, 51, 0.06);
      }

      .bookmark-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: start;
      }

      .bookmark h3 {
        margin: 0 0 4px;
        font-size: 1.05rem;
      }

      .meta {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
      }

      .body {
        margin: 14px 0 0;
        white-space: pre-wrap;
        line-height: 1.55;
      }

      .article {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }

      .article h4 {
        margin: 0 0 8px;
      }

      .article pre {
        margin: 12px 0 0;
        padding: 12px;
        overflow: auto;
        border-radius: 12px;
        background: #0f172a;
        color: #eef2ff;
        font-size: 0.82rem;
      }

      .empty {
        padding: 24px;
        border: 1px dashed var(--border);
        border-radius: 20px;
        color: var(--muted);
        background: rgba(255,255,255,0.75);
      }

      .link {
        color: var(--accent);
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
      }

      @media (max-width: 900px) {
        header, .bookmark-head, .section-head {
          flex-direction: column;
        }

        .status-panel {
          min-width: 0;
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header>
        <div>
          <h1>${escapeHtml(model.title)}</h1>
          <p class="lede">
            Browse the local SQLite cache, trigger sync, and export bookmark snapshots without leaving the browser.
          </p>
        </div>
        <aside class="status-panel">
          <dl>
            <dt>Server</dt>
            <dd>${escapeHtml(model.serverUrl)}</dd>
            <dt>Data dir</dt>
            <dd>${escapeHtml(model.dataDir)}</dd>
            <dt>Export dir</dt>
            <dd>${escapeHtml(model.exportDir)}</dd>
            <dt>Session</dt>
            <dd>${sessionSummary}</dd>
            <dt>Cached bookmarks</dt>
            <dd>${bookmarkCount}</dd>
          </dl>
        </aside>
      </header>

      ${renderNotice(model.notice)}
      ${renderError(model.error)}

      <div class="toolbar">
        <form method="post" action="/sync">
          <button type="submit">Sync bookmarks</button>
        </form>
        <form method="post" action="/export">
          <button type="submit" name="format" value="md">Export Markdown</button>
        </form>
        <form method="post" action="/export">
          <button type="submit" name="format" value="json" class="secondary">Export JSON</button>
        </form>
        <form method="post" action="/export">
          <button type="submit" name="format" value="csv" class="secondary">Export CSV</button>
        </form>
      </div>

      <section>
        <div class="section-head">
          <h2>Cached bookmarks</h2>
          <p>${bookmarkCount} item${bookmarkCount === 1 ? "" : "s"} ready for export.</p>
        </div>
        ${
          model.bookmarks.length > 0
            ? `<div class="bookmarks">${model.bookmarks
                .slice()
                .reverse()
                .map(renderBookmark)
                .join("")}</div>`
            : `<div class="empty">No bookmarks are cached yet. Run sync to fetch them from X.</div>`
        }
      </section>
    </main>
  </body>
</html>`;
}
