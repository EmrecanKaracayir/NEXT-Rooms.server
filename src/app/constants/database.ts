import { Pool } from "pg";

export const pool: Pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "next",
  password: "password",
  port: 5432,
});
