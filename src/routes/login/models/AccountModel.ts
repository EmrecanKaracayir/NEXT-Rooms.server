import { Membership } from "../../../app/enums/Membership";

export class AccountModel {
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
}
