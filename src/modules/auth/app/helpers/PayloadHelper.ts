import { TokenPayload } from "../../../../@types/tokens";
import { Membership } from "../../../../app/enums/Membership";
import { IHelper } from "../../../../app/interfaces/IHelper";

export class PayloadHelper implements IHelper {
  public static isValidPayload(obj: unknown): obj is TokenPayload {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const payload: TokenPayload = obj as TokenPayload;
    return (
      typeof payload.accountId === "number" &&
      Object.values(Membership).includes(payload.membership as Membership) &&
      typeof payload.sessionId === "number"
    );
  }
}
