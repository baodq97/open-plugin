import type { Request, Response, NextFunction } from 'express';
import type { ActivityLogService } from '../../../application/services/activity-log-service.js';
import { serializeActivityCollection } from '../serializers/activity-serializer.js';

export class ActivityController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  getTaskActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId, taskId } = req.params;
      const pageNumber = parseInt(req.query['page[number]'] as string, 10) || 1;
      const pageSize = Math.min(parseInt(req.query['page[size]'] as string, 10) || 20, 100);

      const { data, total } = await this.activityLogService.getTaskActivity(taskId, pageNumber, pageSize);

      res.status(200).json(serializeActivityCollection(
        data,
        { total },
        { self: `/v1/boards/${boardId}/tasks/${taskId}/activity` },
      ));
    } catch (err) {
      next(err);
    }
  };

  getBoardActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId } = req.params;
      const pageNumber = parseInt(req.query['page[number]'] as string, 10) || 1;
      const pageSize = Math.min(parseInt(req.query['page[size]'] as string, 10) || 20, 100);

      const { data, total } = await this.activityLogService.getBoardActivity(boardId, pageNumber, pageSize);

      const totalPages = Math.ceil(total / pageSize);

      res.status(200).json(serializeActivityCollection(
        data,
        { total, page: pageNumber, page_size: pageSize, total_pages: totalPages },
        { self: `/v1/boards/${boardId}/activity` },
      ));
    } catch (err) {
      next(err);
    }
  };
}
