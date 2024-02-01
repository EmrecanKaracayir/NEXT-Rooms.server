import { QueryResult } from "pg";
import { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import { IProvider } from "../../app/interfaces/IProvider";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";
import { SignupModel } from "./models/SignupModel";

export class SignupProvider implements IProvider {
  public async doesAccountExist(username: string): Promise<ProviderResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const accountRes: QueryResult = await DbConstants.POOL.query(Queries.GET_ACCOUNT$UNAME, [
        username,
      ]);
      const accountRec: unknown = accountRes.rows[0];
      if (!accountRec) {
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return {
          data: false,
        };
      }
      if (!SignupModel.isValidModel(accountRec)) {
        throw new ModelMismatchError(accountRec);
      }
      await DbConstants.POOL.query(DbConstants.COMMIT);
      return {
        data: true,
      };
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createAccount(
    username: string,
    password: string,
  ): Promise<ProviderResponse<SignupModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const accountRes: QueryResult = await DbConstants.POOL.query(
        Queries.CREATE_ACCOUNT$UNAME_$PSWRD,
        [username, password],
      );
      const accountRec: unknown = accountRes.rows[0];
      if (!accountRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!SignupModel.isValidModel(accountRec)) {
        throw new ModelMismatchError(accountRec);
      }
      await DbConstants.POOL.query(DbConstants.COMMIT);
      return {
        data: accountRec as SignupModel,
      };
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}

enum Queries {
  GET_ACCOUNT$UNAME = `SELECT * FROM "Account" WHERE "username" = $1;`,
  CREATE_ACCOUNT$UNAME_$PSWRD = `INSERT INTO "Account" ("username", "password") VALUES ($1, $2) RETURNING *;`,
}
