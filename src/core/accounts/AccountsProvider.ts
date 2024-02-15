import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { AccountModel } from "../../app/models/AccountModel";
import { ResponseUtil } from "../../app/utils/ResponseUtil";

export class AccountsProvider implements IProvider {
  public async getAccount(username: string): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const accountRes: QueryResult = await DbConstants.POOL.query(Queries.GET_ACCOUNT$UNAME, [
        username,
      ]);
      const accountRec: unknown = accountRes.rows[0];
      if (!accountRec) {
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return {
          data: null,
        };
      }
      const model: AccountModel = AccountModel.fromRecord(accountRec);
      await DbConstants.POOL.query(DbConstants.COMMIT);
      return ResponseUtil.providerResponse(model);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
}
