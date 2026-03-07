import type { Request, Response, NextFunction } from 'express';
import type { MembershipService } from '../../../application/services/membership-service.js';

/**
 * Middleware factory that checks board access and attaches membership to request.
 */
export function boardAccessMiddleware(membershipService: MembershipService) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const boardId = req.params.boardId;
      const userId = req.userId;

      if (!boardId || !userId) {
        res.status(400).json({
          errors: [{ status: '400', title: 'Bad Request', detail: 'Missing board ID or user ID' }],
        });
        return;
      }

      const membership = await membershipService.checkBoardAccess(boardId, userId);
      // Attach membership to request for downstream use
      (req as Record<string, unknown>).membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
}
