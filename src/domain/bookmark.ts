export type ExportFormat = "md" | "json" | "csv";

export interface Bookmark {
  id: string;
  text: string;
  authorName: string;
  authorHandle: string;
  url: string;
  createdAt: string;
}

export interface BookmarkExport {
  exportedAt: string;
  bookmarks: Bookmark[];
}
