import type { IValidator } from "../interfaces/IValidator";
import { SessionRules } from "../rules/SessionRules";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { StringUtil } from "../utils/StringUtil";

export class SessionKeyValidator implements IValidator {
  public static validate(data: string, clientErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        SessionRules.SESSION_KEY_MIN_LENGTH,
        SessionRules.SESSION_KEY_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_KEY_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, SessionRules.SESSION_KEY_REGEX)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_KEY_CONTENT));
    }
  }
}
