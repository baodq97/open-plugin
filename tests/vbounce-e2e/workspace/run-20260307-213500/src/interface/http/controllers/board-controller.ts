import type { Request, Response, NextFunction } from 'express';
import type { BoardService } from '../../../application/services/board-service.js';
import { serializeBoard } from '../serializers/board-serializer.js';

export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const { attributes } = req.body.data;

      const board = await this.boardService.createBoard(
        userId,
        attributes.name,
        attributes.description,
        attributes.columns,
      );

      res.status(201).json(serializeBoard(board));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { boardId } = req.params;
      const userId = req.userId!;
      const { attributes } = req.body.data;

      const board = await this.boardService.updateBoard(boardId, userId, {
        name: attributes.name,
        description: attributes.description,
        columns: attributes.columns,
      });

      res.status(200).json(serializeBoard(board));
    } catch (err) {
      next(err);
    }
  };
}
