import { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { PasswordValidator } from "../../../app/validators/PasswordValidator";
import { SessionKeyValidator } from "../../../app/validators/SessionKeyValidator";
import { UsernameValidator } from "../../../app/validators/UsernameValidator";

export class SignupRequest implements IRequest {
  constructor(
    public readonly sessionKey: string,
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isBlueprint(obj: unknown): obj is SignupRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint: SignupRequest = obj as SignupRequest;
    return (
      typeof blueprint.sessionKey === "string" &&
      typeof blueprint.username === "string" &&
      typeof blueprint.password === "string"
    );
  }

  public static getValidationErrors(blueprintData: SignupRequest): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    SessionKeyValidator.validate(blueprintData.sessionKey, validationErrors);
    UsernameValidator.validate(blueprintData.username, validationErrors);
    PasswordValidator.validate(blueprintData.password, validationErrors);
    return validationErrors;
  }
}
