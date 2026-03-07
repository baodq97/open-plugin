import type { Board } from '../entities/board.js';

export interface BoardRepository {
  findById(id: string): Promise<Board | null>;
  findByOwnerId(ownerId: string): Promise<Board[]>;
  insert(board: Omit<Board, 'id' | 'created_at' | 'updated_at'>): Promise<Board>;
  update(id: string, data: Partial<Pick<Board, 'name' | 'description' | 'columns'>>): Promise<Board | null>;
}
