import { IRequest } from "../../../app/interfaces/IRequest";
import type { ClientError } from "../../../app/schemas/ClientError";
import { UsernameValidator } from "../../../app/validators/UsernameValidator";

export class AccountsRequest implements IRequest {
  private constructor(public readonly username: string) {}

  public static isBlueprint(data: unknown): data is AccountsRequest {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint: AccountsRequest = data as AccountsRequest;
    return typeof blueprint.username === "string";
  }

  public static getValidationErrors(blueprintData: AccountsRequest): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    UsernameValidator.validate(blueprintData.username, validationErrors);
    return validationErrors;
  }
}
