import { IModel } from "../../../../app/interfaces/IModel";

export class SessionModel implements IModel {
  constructor(
    readonly sessionId: number,
    readonly accountId: number,
    readonly sessionKey: string,
    readonly refreshToken: string,
    readonly lastActivityDate: Date,
  ) {}

  public static isValidModel(obj: unknown): obj is SessionModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: SessionModel = obj as SessionModel;
    return (
      typeof model.sessionId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.sessionKey === "string" &&
      typeof model.refreshToken === "string" &&
      model.lastActivityDate instanceof Date
    );
  }

  public static areValidModels(objs: unknown[]): objs is SessionModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj: unknown): boolean => SessionModel.isValidModel(obj));
  }
}
