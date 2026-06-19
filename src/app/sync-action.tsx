"use client";

export function SyncAction() {
  return (
    <form
      action="/api/sync"
      method="post"
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Sync bookmarks will call the X API and may incur API costs. Continue?",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <button className="button" type="submit">
        Sync bookmarks
      </button>
    </form>
  );
}
