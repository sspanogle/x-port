import type { Bookmark } from "../domain/bookmark.js";
import type { XApiClient } from "./client.js";

interface BookmarkUser {
  id: string;
  username: string;
  name?: string;
}

interface BookmarkTweet {
  id: string;
  text: string;
  created_at?: string;
  author_id?: string;
  username?: string;
}

interface BookmarkPage {
  data?: BookmarkTweet[];
  includes?: {
    users?: BookmarkUser[];
  };
  meta?: {
    next_token?: string;
  };
}

function mapBookmark(
  tweet: BookmarkTweet,
  usersById: Map<string, BookmarkUser>,
): Bookmark {
  const user = tweet.author_id ? usersById.get(tweet.author_id) : undefined;
  const username = user?.username ?? tweet.username ?? "unknown";

  return {
    id: tweet.id,
    text: tweet.text,
    authorName: user?.name ?? username,
    authorHandle: username,
    url: `https://x.com/i/web/status/${tweet.id}`,
    createdAt: tweet.created_at ?? new Date(0).toISOString(),
  };
}

export async function fetchBookmarks(
  client: XApiClient,
  userId: string,
): Promise<Bookmark[]> {
  const collected: Bookmark[] = [];
  let nextToken: string | undefined;

  do {
    const page = await client.getJson<BookmarkPage>(
      `/2/users/${userId}/bookmarks`,
      {
        max_results: 100,
        pagination_token: nextToken,
        "tweet.fields": "author_id,created_at,text",
        expansions: "author_id",
        "user.fields": "id,name,username",
      },
    );

    const usersById = new Map(
      (page.includes?.users ?? []).map((user) => [user.id, user]),
    );
    for (const tweet of page.data ?? []) {
      collected.push(mapBookmark(tweet, usersById));
    }

    nextToken = page.meta?.next_token;
  } while (nextToken);

  return collected;
}
