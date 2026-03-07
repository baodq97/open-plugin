import { Router } from 'express';
import type { TaskController } from '../controllers/task-controller.js';
import { validate } from '../middleware/validate.js';
import { CreateTaskSchema } from '../../../application/dto/create-task.dto.js';
import { UpdateTaskSchema } from '../../../application/dto/update-task.dto.js';

export function taskRoutes(controller: TaskController): Router {
  const router = Router({ mergeParams: true });

  // POST /boards/:boardId/tasks
  router.post('/', validate(CreateTaskSchema), controller.create);

  // GET /boards/:boardId/tasks
  router.get('/', controller.list);

  // GET /boards/:boardId/tasks/:taskId
  router.get('/:taskId', controller.get);

  // PATCH /boards/:boardId/tasks/:taskId
  router.patch('/:taskId', validate(UpdateTaskSchema), controller.update);

  // DELETE /boards/:boardId/tasks/:taskId
  router.delete('/:taskId', controller.delete);

  return router;
}
