export interface PoemAuthor {
  id: number;
  name: string;
  description: string | null;
  dynasty: PoemDynasty;
}

export interface PoemDynasty {
  id: number;
  name: string;
}

export interface PoemType {
  id: number;
  name: string;
}

export interface PoemData {
  id: number;
  title: string;
  content: string[];
  author: PoemAuthor;
  dynasty: PoemDynasty;
  type: PoemType;
}

export interface Pagination {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  lang: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
  lang: string;
}
