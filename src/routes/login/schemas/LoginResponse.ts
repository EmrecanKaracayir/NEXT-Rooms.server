import { Membership } from "../../../app/enums/Membership";
import { AccountModel } from "../models/AccountModel";

export class LoginResponse {
  constructor(
    readonly accountId: number,
    readonly username: string,
    readonly membership: Membership,
  ) {}

  public static fromModel(model: AccountModel): LoginResponse {
    return new LoginResponse(model.accountId, model.username, model.membership);
  }
}
