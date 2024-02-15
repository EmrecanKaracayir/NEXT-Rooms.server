import type { Membership } from "../../../app/enums/Membership";
import { IResponse } from "../../../app/interfaces/IResponse";

export class SignupResponse implements IResponse {
  constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly membership: Membership,
  ) {}
}
