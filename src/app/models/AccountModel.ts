import { Membership } from "../enums/Membership";
import { IModel } from "../interfaces/IModel";

export class AccountModel implements IModel {
  constructor(
    readonly accountId: number,
    readonly username: string,
    readonly password: string,
    readonly membership: Membership,
  ) {}

  public static isValidModel(obj: unknown): obj is AccountModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: AccountModel = obj as AccountModel;
    return (
      typeof model.accountId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string" &&
      Object.values(Membership).includes(model.membership as Membership)
    );
  }

  public static areValidModels(objs: unknown[]): objs is AccountModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj: unknown): boolean => AccountModel.isValidModel(obj));
  }
}
