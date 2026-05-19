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

// 自定义 API（http://122.51.104.131:8000）相关类型
export interface CustomPoem {
  id: string;
  title: string;
  author: string;
  paragraphs: string[];
}

export interface CustomPoemsResponse {
  total: number;
  page: number;
  page_size: number;
  data: CustomPoem[];
}
