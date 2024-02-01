import { QueryResult } from "pg";
import { RawTokenData, Token, TokenPayload, Tokens } from "../../../@types/tokens";
import { DbConstants } from "../../../app/constants/DbConstants";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../../app/schemas/ServerError";
import { SessionConstants } from "../app/constants/SessionConstants";
import { TokenHandler } from "./TokenHandler";
import { SessionModel } from "./models/SessionModel";

export class SessionHandler {
  public static async verifySession(
    refreshToken: Token,
    tokenPayload: TokenPayload,
  ): Promise<boolean> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionRes: QueryResult = await DbConstants.POOL.query(Queries.GET_SESSION$SSID, [
        tokenPayload.sessionId,
      ]);
      const sessionRec: unknown = sessionRes.rows[0];
      if (!sessionRec) {
        return false;
      }
      if (!SessionModel.isValidModel(sessionRec)) {
        throw new ModelMismatchError(sessionRec);
      }
      await DbConstants.POOL.query(DbConstants.COMMIT);
      if (
        tokenPayload.accountId !== sessionRec.accountId ||
        refreshToken !== sessionRec.refreshToken
      ) {
        return false;
      }
      return true;
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public static async createOrUpdateSession(tokenData: RawTokenData): Promise<Tokens> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionRes: QueryResult = await DbConstants.POOL.query(Queries.GET_SESSIONS$ACID, [
        tokenData.accountId,
      ]);
      const sessionRec: unknown[] = sessionRes.rows;
      if (!sessionRec) {
        throw new UnexpectedQueryResultError();
      }
      if (sessionRec.length === 0) {
        // Account has no sessions, create one
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return await SessionHandler.createSession(tokenData);
      }
      if (!SessionModel.areValidModels(sessionRec)) {
        throw new ModelMismatchError(sessionRec);
      }
      // Account has sessions, find one with matching session key
      const session: SessionModel | undefined = sessionRec.find(
        (session: SessionModel): boolean => session.sessionKey === tokenData.sessionKey,
      );
      if (session) {
        // Session found, update it
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return await SessionHandler.updateSession(tokenData, session);
      } else {
        // Session not found, create one
        const tokens: Tokens = await SessionHandler.createSession(tokenData);
        // If account has more than max sessions, delete the oldest one
        await SessionHandler.eliminateSessionIfNecessary(sessionRec);
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return tokens;
      }
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  private static async createSession(tokenData: RawTokenData): Promise<Tokens> {
    const sessionRes: QueryResult = await DbConstants.POOL.query(
      Queries.INSERT_SESSION$ACID_$SKEY,
      [tokenData.accountId, tokenData.sessionKey],
    );
    const sessionRec: unknown = sessionRes.rows[0];
    if (!sessionRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!SessionModel.isValidModel(sessionRec)) {
      throw new ModelMismatchError(sessionRec);
    }
    // Create payload
    const payload: TokenPayload = {
      accountId: tokenData.accountId,
      membership: tokenData.membership,
      sessionId: sessionRec.sessionId,
    };
    // Generate tokens
    const tokens: Tokens = TokenHandler.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(Queries.UPDATE_SESSION$SSID_$RTOKEN_$DATE, [
      sessionRec.sessionId,
      tokens.refreshToken,
      new Date().toISOString(),
    ]);
    // Return tokens
    return tokens;
  }

  private static async eliminateSessionIfNecessary(sessions: SessionModel[]): Promise<void> {
    const sessionCount: number = sessions.length + 1;
    // If account has more than max sessions, delete the oldest one
    if (sessionCount > SessionConstants.MAX_SESSION_COUNT) {
      // Find the oldest session
      const oldestSession: SessionModel = sessions.reduce(
        (prev: SessionModel, curr: SessionModel): SessionModel => {
          return curr.lastActivityDate < prev.lastActivityDate ? curr : prev;
        },
      );
      await DbConstants.POOL.query(Queries.DELETE_SESSION$SSID, [oldestSession.sessionId]);
    }
  }

  private static async updateSession(
    tokenData: RawTokenData,
    session: SessionModel,
  ): Promise<Tokens> {
    // Create payload
    const payload: TokenPayload = {
      accountId: tokenData.accountId,
      membership: tokenData.membership,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens: Tokens = TokenHandler.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(Queries.UPDATE_SESSION$SSID_$RTOKEN_$DATE, [
      session.sessionId,
      tokens.refreshToken,
      new Date().toISOString(),
    ]);
    // Return tokens
    return tokens;
  }
}

enum Queries {
  GET_SESSIONS$ACID = `SELECT * FROM "Session" WHERE "accountId" = $1`,
  GET_SESSION$SSID = `SELECT * FROM "Session" WHERE "sessionId" = $1`,
  INSERT_SESSION$ACID_$SKEY = `INSERT INTO "Session" ("accountId", "sessionKey") VALUES ($1, $2) RETURNING *`,
  UPDATE_SESSION$SSID_$RTOKEN_$DATE = `UPDATE "Session" SET "refreshToken" = $2, "lastActivityDate" = $3 WHERE "sessionId" = $1`,
  DELETE_SESSION$SSID = `DELETE FROM "Session" WHERE "sessionId" = $1`,
}
