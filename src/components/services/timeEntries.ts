import { CreateTimeEntry } from "@/types/models";
import db from "../database/db";
import { QueryResult } from "@tauri-apps/plugin-sql";

export async function startTimeEntry(timeEntry: CreateTimeEntry) {
  const result: QueryResult = await db.execute(
    "INSERT INTO time_entries (id, user_id, task_name, note, start_time) VALUES (NULL, $1, $2, $3, $4) RETURNING *;",
    [
      timeEntry.user_id,
      timeEntry.task_name,
      timeEntry.note,
      timeEntry.start_time,
    ]
  );
  return result as unknown as {
    lastInsertId: number;
    rowsAffected: number;
  };
}

export async function finishTimeEntry(timeEntryId: number, endTime: string) {
  const result: QueryResult = await db.execute(
    "UPDATE time_entries SET end_time = $1 WHERE id = $2 RETURNING *;",
    [endTime, timeEntryId]
  );
  return result as unknown as {
    lastInsertId: number;
    rowsAffected: number;
  };
}

export async function getTimeEntriesByWeek(
  userId: number,
  weekStart: string,
  weekEnd: string
) {
  const result: QueryResult = await db.execute(
    "SELECT * FROM time_entries WHERE user_id = $1 AND start_time >= $2 AND end_time <= $3;",
    [userId, weekStart, weekEnd]
  );
  return result as unknown as {
    rows: Array<CreateTimeEntry>;
  };
}

export async function getTimeEntryByDay(
  userId: number,
  dayStart: string,
  dayEnd: string
) {
  const result: QueryResult = await db.execute(
    "SELECT * FROM time_entries WHERE user_id = $1 AND start_time >= $2 AND end_time <= $3;",
    [userId, dayStart, dayEnd]
  );
  return result as unknown as {
    rows: Array<CreateTimeEntry>;
  };
}
