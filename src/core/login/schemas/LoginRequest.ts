import { IRequest } from "../../../app/interfaces/IRequest";

export class LoginRequest implements IRequest {
  constructor(
    public readonly sessionKey: string,
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidReq(obj: unknown): obj is LoginRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: LoginRequest = obj as LoginRequest;
    return (
      typeof req.sessionKey === "string" &&
      typeof req.username === "string" &&
      typeof req.password === "string"
    );
  }
}
