import type { Bookmark } from "../domain/bookmark";
import type { XApiClient } from "./client";

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
  note_tweet?: { text?: string; full_text?: string } | string;
  article?: Record<string, unknown>;
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
  const noteTweetText =
    typeof tweet.note_tweet === "string"
      ? tweet.note_tweet
      : (tweet.note_tweet?.full_text ?? tweet.note_tweet?.text);
  const article =
    tweet.article && Object.keys(tweet.article).length > 0
      ? tweet.article
      : undefined;

  return {
    id: tweet.id,
    text: tweet.text,
    fullText: noteTweetText ?? tweet.text,
    authorName: user?.name ?? username,
    authorHandle: username,
    url: `https://x.com/i/web/status/${tweet.id}`,
    createdAt: tweet.created_at ?? new Date(0).toISOString(),
    ...(article ? { article } : {}),
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
        "tweet.fields": "author_id,article,created_at,note_tweet,text",
        expansions: "article.cover_media,article.media_entities,author_id",
        "media.fields": "alt_text,height,preview_image_url,type,url,width",
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
