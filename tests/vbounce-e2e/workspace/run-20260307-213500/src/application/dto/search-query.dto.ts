import { z } from 'zod';

const ALLOWED_FILTER_FIELDS = ['status', 'priority', 'assignee', 'tags', 'board', 'due_date_from', 'due_date_to'] as const;
const ALLOWED_SORT_FIELDS = ['created_at', 'updated_at', 'due_date', 'priority'] as const;

export const SearchQuerySchema = z.object({
  q: z.string().max(200, 'Search query must not exceed 200 characters').optional(),
  filter: z.record(z.string()).optional(),
  sort: z.string().optional(),
  page: z.object({
    number: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).max(100, 'Page size must not exceed 100').default(20),
  }).optional(),
});

export type SearchQueryDTO = z.infer<typeof SearchQuerySchema>;

export { ALLOWED_FILTER_FIELDS, ALLOWED_SORT_FIELDS };
