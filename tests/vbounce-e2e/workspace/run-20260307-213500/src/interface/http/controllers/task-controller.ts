import type { Request, Response, NextFunction } from 'express';
import type { TaskService } from '../../../application/services/task-service.js';
import { serializeTask, serializeTaskCollection } from '../serializers/task-serializer.js';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId } = req.params;
      const userId = req.userId!;
      const { attributes } = req.body.data;

      const task = await this.taskService.createTask(boardId, userId, {
        title: attributes.title,
        description: attributes.description,
        status: attributes.status,
        priority: attributes.priority,
        assignee: attributes.assignee,
        due_date: attributes.due_date,
        tags: attributes.tags,
      });

      res.status(201).json(serializeTask(task));
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId } = req.params;
      const tasks = await this.taskService.listTasks(boardId);

      res.status(200).json(serializeTaskCollection(
        tasks,
        { total: tasks.length },
        { self: `/v1/boards/${boardId}/tasks` },
      ));
    } catch (err) {
      next(err);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId, taskId } = req.params;
      const task = await this.taskService.getTask(boardId, taskId);

      res.status(200).json(serializeTask(task));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId, taskId } = req.params;
      const userId = req.userId!;
      const { attributes } = req.body.data;

      const task = await this.taskService.updateTask(boardId, taskId, userId, {
        title: attributes.title,
        description: attributes.description,
        status: attributes.status,
        priority: attributes.priority,
        assignee: attributes.assignee,
        due_date: attributes.due_date,
        tags: attributes.tags,
      });

      res.status(200).json(serializeTask(task));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId, taskId } = req.params;
      const userId = req.userId!;

      const task = await this.taskService.deleteTask(boardId, taskId, userId);

      res.status(200).json({
        data: {
          type: 'tasks',
          id: task.id,
          attributes: {
            title: task.title,
            status: task.status,
            deleted_at: task.deleted_at?.toISOString(),
          },
          links: {
            self: `/v1/boards/${boardId}/tasks/${task.id}`,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
