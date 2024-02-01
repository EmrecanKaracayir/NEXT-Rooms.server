import { Pool } from "pg";
import { IConstants } from "../interfaces/IConstants";

export class DbConstants implements IConstants {
  public static readonly POOL: Pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "next",
    password: "password",
    port: 5432,
  });
  public static readonly BEGIN: string = "BEGIN";
  public static readonly COMMIT: string = "COMMIT";
  public static readonly ROLLBACK: string = "ROLLBACK";
}
