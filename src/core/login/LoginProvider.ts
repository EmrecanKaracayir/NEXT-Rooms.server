import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { LoginModel } from "./models/LoginModel";

export class LoginProvider implements IProvider {
  public async getAccount(username: string): Promise<ProviderResponse<LoginModel | null>> {
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
      if (!LoginModel.isValidModel(accountRec)) {
        throw new ModelMismatchError(accountRec);
      }
      await DbConstants.POOL.query(DbConstants.COMMIT);
      return {
        data: accountRec as LoginModel,
      };
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
}
