import type { Membership } from "../../../app/enums/Membership";
import { IModel } from "../../../app/interfaces/IModel";

export class SignupModel implements IModel {
  constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly membership: Membership,
  ) {}
}
