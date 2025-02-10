export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

export interface TimeEntry {
  id: number;
  user_id: number;
  task_name: string;
  note: string | null;
  start_time: string; // ISO 8601 date string
  end_time: string; // ISO 8601 date string
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

// For creating new records
export interface CreateUser {
  email: string;
  name: string;
}

export interface CreateTimeEntry {
  user_id: number;
  task_name: string;
  note?: string;
  start_time: string; // ISO 8601 date string
  end_time: string; // ISO 8601 date string
}
