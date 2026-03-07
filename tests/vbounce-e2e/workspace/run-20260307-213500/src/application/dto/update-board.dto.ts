import { z } from 'zod';

export const UpdateBoardSchema = z.object({
  data: z.object({
    type: z.literal('boards'),
    id: z.string().optional(),
    attributes: z.object({
      name: z.string().max(100, 'Board name must not exceed 100 characters').optional(),
      description: z.string().max(500, 'Description must not exceed 500 characters').optional().nullable(),
      columns: z
        .array(z.string().min(1).max(50))
        .min(2, 'A board must have at least 2 columns')
        .optional(),
    }),
  }),
});

export type UpdateBoardDTO = z.infer<typeof UpdateBoardSchema>;
