import { QueryResult } from "pg";
import { TokenPayload } from "../../../@types/tokens";
import { DbConstants } from "../../../app/constants/DbConstants";
import { AccountModel } from "../../../app/models/AccountModel";
import { ModelMismatchError } from "../../../app/schemas/ServerError";

export class AccountHandler {
  public static async verifyAccount(tokenPayload: TokenPayload): Promise<boolean> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const accountRes: QueryResult = await DbConstants.POOL.query(Queries.GET_ACCOUNT$ACID, [
        tokenPayload.accountId,
      ]);
      const accountRec: unknown = accountRes.rows[0];
      if (!accountRec) {
        return false;
      }
      if (!AccountModel.isValidModel(accountRec)) {
        throw new ModelMismatchError(accountRec);
      }
      await DbConstants.POOL.query(DbConstants.COMMIT);
      return true;
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$ACID = `SELECT * FROM "Account" WHERE "accountId" = $1`,
}
