import { loadDashboardState } from "../web/dashboard";
import { SyncAction } from "./sync-action";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
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

function formatArticle(article: Record<string, unknown>): {
  title: string | undefined;
  text: string | undefined;
  raw: string;
} {
  const title = typeof article.title === "string" ? article.title : undefined;
  const text = typeof article.text === "string" ? article.text : undefined;

  return {
    title,
    text,
    raw: JSON.stringify(article, null, 2),
  };
}

export default async function Page(props: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const searchParams = await Promise.resolve(props.searchParams ?? {});
  const state = loadDashboardState();
  const notice = firstValue(searchParams.notice);
  const error = firstValue(searchParams.error);

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">X-Port Dashboard</p>
          <h1 className="title">Browse cached bookmarks in the browser.</h1>
          <p className="lede">
            This local Next.js app reads the same SQLite cache as the CLI. Use
            it to inspect bookmarks, sync fresh ones from X, and export local
            snapshots without leaving your machine.
          </p>
        </div>

        <aside className="status-panel">
          <dl className="status-list">
            <dt>Data dir</dt>
            <dd>{state.dataDir}</dd>
            <dt>Export dir</dt>
            <dd>{state.exportDir}</dd>
            <dt>Session</dt>
            <dd>
              {state.session
                ? `@${state.session.username} (${state.session.userId})`
                : "No saved session"}
            </dd>
            <dt>Cached bookmarks</dt>
            <dd>{state.bookmarks.length}</dd>
          </dl>
        </aside>
      </header>

      {notice ? <div className="banner banner-notice">{notice}</div> : null}
      {error ? <div className="banner banner-error">{error}</div> : null}

      <div className="toolbar">
        <form action="/api/login" method="post">
          <button type="submit">Login with X</button>
        </form>
        <SyncAction />

        <form action="/api/export" method="post">
          <button className="button secondary" type="submit" name="format" value="md">
            Export Markdown
          </button>
        </form>

        <form action="/api/export" method="post">
          <button className="button secondary" type="submit" name="format" value="json">
            Export JSON
          </button>
        </form>

        <form action="/api/export" method="post">
          <button className="button secondary" type="submit" name="format" value="csv">
            Export CSV
          </button>
        </form>
      </div>

      <section>
        <div className="section-head">
          <h2>Cached bookmarks</h2>
          <p>
            {state.bookmarks.length} item{state.bookmarks.length === 1 ? "" : "s"} ready
            for export.
          </p>
        </div>

        {state.bookmarks.length > 0 ? (
          <div className="bookmarks">
            {[...state.bookmarks].reverse().map((bookmark) => {
              const article = bookmark.article ? formatArticle(bookmark.article) : null;

              return (
                <article className="bookmark" key={bookmark.id}>
                  <div className="bookmark-head">
                    <div>
                      <h3>{bookmark.text}</h3>
                      <p className="meta">
                        {bookmark.authorName} @{bookmark.authorHandle} ·{" "}
                        {formatDateTime(bookmark.createdAt)}
                      </p>
                    </div>
                    <a className="link" href={bookmark.url} target="_blank" rel="noreferrer">
                      Open post
                    </a>
                  </div>

                  <p className="body">{bookmark.fullText ?? bookmark.text}</p>

                  {article ? (
                    <section className="article">
                      <h4>Article</h4>
                      {article.title ? (
                        <p>
                          <strong>Title:</strong> {article.title}
                        </p>
                      ) : null}
                      {article.text ? (
                        <p>
                          <strong>Body:</strong> {article.text}
                        </p>
                      ) : null}
                      <details>
                        <summary>Raw article metadata</summary>
                        <pre>{article.raw}</pre>
                      </details>
                    </section>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            No bookmarks are cached yet. Run sync to fetch them from X.
          </div>
        )}
      </section>

      <p className="footer">
        Login still happens in the terminal. If you need to create or refresh
        credentials, run <code>xport login</code> from the CLI first.
      </p>
    </main>
  );
}
