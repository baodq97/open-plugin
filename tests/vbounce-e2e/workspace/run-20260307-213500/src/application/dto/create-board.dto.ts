import { z } from 'zod';

export const CreateBoardSchema = z.object({
  data: z.object({
    type: z.literal('boards'),
    attributes: z.object({
      name: z
        .string({ required_error: 'Board name is required' })
        .min(1, 'Board name is required')
        .max(100, 'Board name must not exceed 100 characters'),
      description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
      columns: z
        .array(z.string().min(1).max(50))
        .min(2, 'A board must have at least 2 columns')
        .optional(),
    }),
  }),
});

export type CreateBoardDTO = z.infer<typeof CreateBoardSchema>;
