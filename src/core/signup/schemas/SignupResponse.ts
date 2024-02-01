import { Membership } from "../../../app/enums/Membership";
import { IResponse } from "../../../app/interfaces/IResponse";
import { SignupModel } from "../models/SignupModel";

export class SignupResponse implements IResponse {
  constructor(
    readonly accountId: number,
    readonly username: string,
    readonly membership: Membership,
  ) {}

  public static fromModel(model: SignupModel): SignupResponse {
    return new SignupResponse(model.accountId, model.username, model.membership);
  }

  public static fromModels(models: SignupModel[]): SignupResponse[] {
    return models.map((model: SignupModel): SignupResponse => SignupResponse.fromModel(model));
  }
}
