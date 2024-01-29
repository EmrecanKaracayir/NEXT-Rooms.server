export class LoginRequest {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly sessionKey: string,
  ) {}

  public static isValidReq(obj: unknown): obj is LoginRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const req: LoginRequest = obj as LoginRequest;
    return (
      typeof req.username === "string" &&
      typeof req.password === "string" &&
      typeof req.sessionKey === "string"
    );
  }
}
