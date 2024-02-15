import { IRequest } from "../../../app/interfaces/IRequest";

export class LoginRequest implements IRequest {
  constructor(
    public readonly sessionKey: string,
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidRequest(obj: unknown): obj is LoginRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const request: LoginRequest = obj as LoginRequest;
    return (
      typeof request.sessionKey === "string" &&
      typeof request.username === "string" &&
      typeof request.password === "string"
    );
  }
}
