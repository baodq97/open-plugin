import type { Request, Response, NextFunction } from 'express';
import type { SearchService } from '../../../application/services/search-service.js';
import { serializeTaskCollection } from '../serializers/task-serializer.js';

export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const q = req.query.q as string | undefined;

      // Parse filter params
      const filterParams: Record<string, string> = {};
      for (const [key, value] of Object.entries(req.query)) {
        const match = key.match(/^filter\[(\w+)]$/);
        if (match && typeof value === 'string') {
          filterParams[match[1]] = value;
        }
      }

      // Parse pagination
      const pageNumber = parseInt(req.query['page[number]'] as string, 10) || 1;
      const pageSize = parseInt(req.query['page[size]'] as string, 10) || 20;

      if (pageSize > 100) {
        res.status(422).json({
          errors: [{
            status: '422',
            title: 'Validation Error',
            detail: 'Page size must not exceed 100',
          }],
        });
        return;
      }

      const sort = req.query.sort as string | undefined;

      const result = await this.searchService.search(
        userId,
        q,
        Object.keys(filterParams).length > 0 ? filterParams : undefined,
        pageNumber,
        pageSize,
        sort,
      );

      const basePath = '/v1/tasks/search';
      const queryString = new URLSearchParams();
      if (q) queryString.set('q', q);
      for (const [k, v] of Object.entries(filterParams)) {
        queryString.set(`filter[${k}]`, v);
      }
      if (sort) queryString.set('sort', sort);

      const links: Record<string, string> = {
        self: `${basePath}?${queryString.toString()}&page[number]=${pageNumber}&page[size]=${pageSize}`,
      };

      if (pageNumber < result.totalPages) {
        links.next = `${basePath}?${queryString.toString()}&page[number]=${pageNumber + 1}&page[size]=${pageSize}`;
      }
      if (result.totalPages > 0) {
        links.last = `${basePath}?${queryString.toString()}&page[number]=${result.totalPages}&page[size]=${pageSize}`;
      }

      res.status(200).json(serializeTaskCollection(
        result.data,
        {
          total: result.total,
          page: result.page,
          page_size: result.pageSize,
          total_pages: result.totalPages,
        },
        links,
      ));
    } catch (err) {
      next(err);
    }
  };
}
