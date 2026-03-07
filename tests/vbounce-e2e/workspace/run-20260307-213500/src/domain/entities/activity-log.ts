export interface ActivityLog {
  id: string;
  board_id: string;
  task_id: string | null;
  actor_id: string;
  action: string;
  changes: Record<string, unknown>;
  created_at: Date;
}
