export type ExportFormat = "md" | "json" | "csv";

export interface Bookmark {
  id: string;
  text: string;
  fullText?: string;
  authorName: string;
  authorHandle: string;
  url: string;
  createdAt: string;
  article?: Record<string, unknown>;
}

export interface BookmarkExport {
  exportedAt: string;
  bookmarks: Bookmark[];
}
