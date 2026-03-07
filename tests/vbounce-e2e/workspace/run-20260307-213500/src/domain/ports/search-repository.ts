import type { Task } from '../entities/task.js';

export interface SearchFilters {
  status?: string;
  priority?: string;
  assignee?: string;
  tags?: string[];
  board?: string;
  due_date_from?: string;
  due_date_to?: string;
}

export interface SearchPagination {
  page: number;
  pageSize: number;
}

export interface SearchSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchResult {
  data: Task[];
  total: number;
}

export interface SearchRepository {
  fullTextSearch(
    boardIds: string[],
    query: string,
    filters: SearchFilters,
    pagination: SearchPagination,
    sort: SearchSort,
  ): Promise<SearchResult>;
}
