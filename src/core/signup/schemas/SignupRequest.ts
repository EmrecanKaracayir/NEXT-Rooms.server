import { IRequest } from "../../../app/interfaces/IRequest";

export class SignupRequest implements IRequest {
  constructor(
    public readonly sessionKey: string,

    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidReq(obj: unknown): obj is SignupRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: SignupRequest = obj as SignupRequest;
    return (
      typeof req.sessionKey === "string" &&
      typeof req.username === "string" &&
      typeof req.password === "string"
    );
  }
}
