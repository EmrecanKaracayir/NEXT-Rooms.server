import { IRequest } from "../../../app/interfaces/IRequest";

export class SignupRequest implements IRequest {
  constructor(
    public readonly sessionKey: string,
    public readonly username: string,
    public readonly password: string,
  ) {}
}
