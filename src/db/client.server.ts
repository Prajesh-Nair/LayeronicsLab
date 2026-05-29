import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

let sql: ReturnType<typeof postgres> | undefined;
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres connection string (e.g. Neon) to your .env file.",
    );
  }
  return url;
}

export function getDb() {
  if (!db) {
    sql = postgres(getDatabaseUrl(), { prepare: false });
    db = drizzle(sql, { schema });
  }
  return db;
}
