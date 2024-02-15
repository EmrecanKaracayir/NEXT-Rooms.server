import { Pool } from "pg";
import { EnvironmentHelper } from "../helpers/EnvironmentHelper";
import { IConstants } from "../interfaces/IConstants";

export class DbConstants implements IConstants {
  public static readonly POOL: Pool = new Pool({
    user: EnvironmentHelper.get().poolUser,
    host: EnvironmentHelper.get().poolHost,
    database: EnvironmentHelper.get().poolDatabase,
    password: EnvironmentHelper.get().poolPassword,
    port: EnvironmentHelper.get().poolPort,
  });
  public static readonly BEGIN: string = "BEGIN";
  public static readonly COMMIT: string = "COMMIT";
  public static readonly ROLLBACK: string = "ROLLBACK";
}
