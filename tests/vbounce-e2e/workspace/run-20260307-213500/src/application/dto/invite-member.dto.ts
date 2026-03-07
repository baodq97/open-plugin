import { z } from 'zod';
import { MEMBER_ROLE_VALUES } from '../../domain/enums/member-role.js';

export const InviteMemberSchema = z.object({
  data: z.object({
    type: z.literal('board-members'),
    attributes: z.object({
      user_id: z.string({ required_error: 'user_id is required' }).uuid('user_id must be a valid UUID'),
      role: z.enum(MEMBER_ROLE_VALUES as [string, ...string[]], {
        errorMap: () => ({ message: 'Role must be one of: Admin, Member, Viewer' }),
      }),
    }),
  }),
});

export type InviteMemberDTO = z.infer<typeof InviteMemberSchema>;
