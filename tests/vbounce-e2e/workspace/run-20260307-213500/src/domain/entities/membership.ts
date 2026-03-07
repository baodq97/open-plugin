import type { MemberRole } from '../enums/member-role.js';

export interface Membership {
  id: string;
  board_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: Date;
  updated_at: Date;
}
