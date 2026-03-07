import { Router } from 'express';
import type { MemberController } from '../controllers/member-controller.js';
import { validate } from '../middleware/validate.js';
import { InviteMemberSchema } from '../../../application/dto/invite-member.dto.js';

export function memberRoutes(controller: MemberController): Router {
  const router = Router({ mergeParams: true });

  // POST /boards/:boardId/members
  router.post('/', validate(InviteMemberSchema), controller.invite);

  return router;
}
