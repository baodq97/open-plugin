import { Router } from 'express';
import type { BoardController } from '../controllers/board-controller.js';
import { validate } from '../middleware/validate.js';
import { CreateBoardSchema } from '../../../application/dto/create-board.dto.js';
import { UpdateBoardSchema } from '../../../application/dto/update-board.dto.js';

export function boardRoutes(controller: BoardController): Router {
  const router = Router();

  // POST /boards
  router.post('/', validate(CreateBoardSchema), controller.create);

  // PATCH /boards/:boardId
  router.patch('/:boardId', validate(UpdateBoardSchema), controller.update);

  return router;
}
