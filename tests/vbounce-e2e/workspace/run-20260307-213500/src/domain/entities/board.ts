export interface Board {
  id: string;
  name: string;
  description: string | null;
  columns: string[];
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}
