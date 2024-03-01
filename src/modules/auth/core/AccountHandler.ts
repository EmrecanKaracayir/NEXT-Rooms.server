import { QueryResult } from "pg";
import { TokenPayload } from "../../../@types/tokens";
import { DbConstants } from "../../../app/constants/DbConstants";
import { AccountModel } from "../../../app/models/AccountModel";
import type { HandlerResponse } from "../@types/responses";
import type { IHandler } from "../app/interfaces/IHandler";
import { AuthResponseUtil } from "../app/utils/AuthResponseUtil";

export class AccountHandler implements IHandler {
  public static async verifyAccount(tokenPayload: TokenPayload): Promise<HandlerResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results: QueryResult = await DbConstants.POOL.query(Queries.GET_ACCOUNT$ACID, [
        tokenPayload.accountId,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await AuthResponseUtil.handlerResponse(false);
      }
      const model: AccountModel = AccountModel.fromRecord(record);
      return await AuthResponseUtil.handlerResponse(model ? true : false);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$ACID = `SELECT * FROM "Account" WHERE "accountId" = $1`,
}
