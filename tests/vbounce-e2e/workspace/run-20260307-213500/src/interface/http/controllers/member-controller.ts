import type { Request, Response, NextFunction } from 'express';
import type { MembershipService } from '../../../application/services/membership-service.js';
import type { MemberRole } from '../../../domain/enums/member-role.js';
import { serializeMembership } from '../serializers/membership-serializer.js';

export class MemberController {
  constructor(private readonly membershipService: MembershipService) {}

  invite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId } = req.params;
      const actorId = req.userId!;
      const { attributes } = req.body.data;

      const { membership, isNew } = await this.membershipService.inviteMember(
        boardId,
        actorId,
        attributes.user_id,
        attributes.role as MemberRole,
      );

      res.status(isNew ? 201 : 200).json(serializeMembership(membership));
    } catch (err) {
      next(err);
    }
  };
}
