import type { Board } from '../../../domain/entities/board.js';

export function serializeBoard(board: Board, baseUrl: string = '/v1'): Record<string, unknown> {
  return {
    data: {
      type: 'boards',
      id: board.id,
      attributes: {
        name: board.name,
        description: board.description,
        columns: board.columns,
        owner_id: board.owner_id,
        created_at: board.created_at.toISOString(),
        updated_at: board.updated_at.toISOString(),
      },
      links: {
        self: `${baseUrl}/boards/${board.id}`,
      },
    },
  };
}
