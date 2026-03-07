import type { Membership } from '../../../domain/entities/membership.js';

export function serializeMembership(membership: Membership, baseUrl: string = '/v1'): Record<string, unknown> {
  return {
    data: {
      type: 'board-members',
      id: membership.id,
      attributes: {
        user_id: membership.user_id,
        role: membership.role,
        joined_at: membership.joined_at.toISOString(),
      },
      relationships: {
        board: {
          data: { type: 'boards', id: membership.board_id },
        },
      },
      links: {
        self: `${baseUrl}/boards/${membership.board_id}/members/${membership.id}`,
      },
    },
  };
}
