import { QueryResult } from "pg";
import { pool } from "../../app/constants/database";
import { IProvider } from "../../app/interfaces/IProvider";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { AccountModel } from "./models/AccountModel";

export class LoginProvider implements IProvider {
  public async getAccount(username: string): Promise<AccountModel | null> {
    const accountRes: QueryResult = await pool.query(Queries.GET_ACCOUNT$UNAME, [username]);
    const accountRec: unknown = accountRes.rows[0];
    if (!accountRec) {
      return null;
    }
    if (!AccountModel.isValidModel(accountRec)) {
      throw new ModelMismatchError(accountRec);
    }
    return accountRec as AccountModel;
  }
}

enum Queries {
  GET_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
}
