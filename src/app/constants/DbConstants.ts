import { Pool } from "pg";
import { EnvironmentHelper } from "../helpers/EnvironmentHelper";
import { IConstants } from "../interfaces/IConstants";

export class DbConstants implements IConstants {
  public static readonly POOL: Pool = new Pool({
    user: `"UNext"`,
    host: "localhost",
    database: `"DNext"`,
    password: EnvironmentHelper.get().poolPassword,
    port: 5432,
  });
  public static readonly BEGIN: string = "BEGIN";
  public static readonly COMMIT: string = "COMMIT";
  public static readonly ROLLBACK: string = "ROLLBACK";
}
