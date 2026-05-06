export interface BaseEntity {
  id: number;
}

export interface ApiResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export type SortOrder = "asc" | "desc";

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
