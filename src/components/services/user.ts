import { CreateUser } from "@/types/models";
import db from "../database/db";
import { QueryResult } from "@tauri-apps/plugin-sql";

export async function createUser(user: CreateUser) {
  const result: QueryResult = await db.execute(
    "INSERT INTO users (id, email, name)  VALUES (NULL, $1, $2) RETURNING *;",
    [user.email, user.name]
  );

  return result as unknown as {
    lastInsertId: number;
    rowsAffected: number;
  };
}
