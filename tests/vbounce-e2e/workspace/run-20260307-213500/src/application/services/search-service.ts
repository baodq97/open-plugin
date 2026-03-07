import type { Task } from '../../domain/entities/task.js';
import type { SearchRepository, SearchFilters, SearchSort } from '../../domain/ports/search-repository.js';
import type { MembershipRepository } from '../../domain/ports/membership-repository.js';
import { AppError } from '../../interface/http/middleware/error-handler.js';
import { ALLOWED_FILTER_FIELDS, ALLOWED_SORT_FIELDS } from '../dto/search-query.dto.js';

export interface SearchResult {
  data: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class SearchService {
  constructor(
    private readonly searchRepo: SearchRepository,
    private readonly membershipRepo: MembershipRepository,
  ) {}

  async search(
    userId: string,
    query: string | undefined,
    filterParams: Record<string, string> | undefined,
    page: number,
    pageSize: number,
    sortParam: string | undefined,
  ): Promise<SearchResult> {
    // Validate that either q or filters are provided
    if (!query && (!filterParams || Object.keys(filterParams).length === 0)) {
      throw new AppError(422, "Search query parameter 'q' is required");
    }

    // Validate filter fields
    const filters: SearchFilters = {};
    if (filterParams) {
      for (const [key, value] of Object.entries(filterParams)) {
        if (!(ALLOWED_FILTER_FIELDS as readonly string[]).includes(key)) {
          throw new AppError(400, `Unknown filter field: ${key}`);
        }
        if (key === 'tags') {
          filters.tags = value.split(',');
        } else {
          (filters as Record<string, string>)[key] = value;
        }
      }
    }

    // Parse sort
    const sort: SearchSort = this.parseSort(sortParam);

    // Scope to accessible boards
    const boardIds = await this.membershipRepo.getAccessibleBoardIds(userId);
    if (boardIds.length === 0) {
      return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }

    // If board filter specified, intersect with accessible
    if (filters.board) {
      if (!boardIds.includes(filters.board)) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
      }
    }

    const result = await this.searchRepo.fullTextSearch(
      boardIds,
      query ?? '',
      filters,
      { page, pageSize },
      sort,
    );

    return {
      data: result.data,
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    };
  }

  private parseSort(sortParam: string | undefined): SearchSort {
    if (!sortParam) {
      return { field: 'created_at', direction: 'desc' };
    }

    const direction = sortParam.startsWith('-') ? 'desc' : 'asc';
    const field = sortParam.replace(/^-/, '');

    if (!(ALLOWED_SORT_FIELDS as readonly string[]).includes(field)) {
      return { field: 'created_at', direction: 'desc' };
    }

    return { field, direction };
  }
}
