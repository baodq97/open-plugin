import { z } from 'zod';
import { TASK_STATUS_VALUES } from '../../domain/enums/task-status.js';
import { TASK_PRIORITY_VALUES } from '../../domain/enums/task-priority.js';

export const CreateTaskSchema = z.object({
  data: z.object({
    type: z.literal('tasks'),
    attributes: z.object({
      title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title is required')
        .max(200, 'Title must not exceed 200 characters'),
      description: z.string().max(5000, 'Description must not exceed 5000 characters').optional(),
      status: z.enum(TASK_STATUS_VALUES as [string, ...string[]], {
        errorMap: () => ({ message: 'Status must be one of: todo, in_progress, review, done' }),
      }).optional(),
      priority: z.enum(TASK_PRIORITY_VALUES as [string, ...string[]], {
        errorMap: () => ({ message: 'Priority must be one of: P0, P1, P2, P3' }),
      }).optional(),
      assignee: z.string().uuid().optional().nullable(),
      due_date: z.string().date().optional().nullable(),
      tags: z
        .array(z.string().max(50, 'Each tag must not exceed 50 characters'))
        .max(10, 'Maximum 10 tags allowed')
        .optional(),
    }),
  }),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
