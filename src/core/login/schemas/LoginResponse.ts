import { Membership } from "../../../app/enums/Membership";
import { IResponse } from "../../../app/interfaces/IResponse";
import { LoginModel } from "../models/LoginModel";

export class LoginResponse implements IResponse {
  constructor(
    readonly accountId: number,
    readonly username: string,
    readonly membership: Membership,
  ) {}

  public static fromModel(model: LoginModel): LoginResponse {
    return new LoginResponse(model.accountId, model.username, model.membership);
  }

  public static fromModels(models: LoginModel[]): LoginResponse[] {
    return models.map((model: LoginModel): LoginResponse => LoginResponse.fromModel(model));
  }
}
