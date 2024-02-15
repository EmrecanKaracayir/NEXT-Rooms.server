import { IRequest } from "../../../app/interfaces/IRequest";

export class AccountsRequest implements IRequest {
  private constructor(public readonly username: string) {}

  public static isBlueprint(data: unknown): data is AccountsRequest {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint: AccountsRequest = data as AccountsRequest;
    return typeof blueprint.username === "string";
  }
}
