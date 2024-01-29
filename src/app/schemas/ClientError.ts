import { ClientErrorCodeMap } from "../../@types";

export class ClientError {
  public readonly code: number;
  public readonly message: string;

  constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}

export enum ClientErrorCode {
  // NON-USER RELATED (1XXXX - 5XXXX)
  // - 1XXXX: Contract errors
  INVALID_REQUEST_BODY = 10000,
  //
  // USER RELATED ERRORS (6XXXX - 9XXXX)
  // - 6XXXX: Authorization errors
  INVALID_TOKEN = 60000,
  EXPIRED_TOKEN = 60001,
  FORBIDDEN_ACCESS = 60002,
  // - 7XXXX: Request errors
  // - - 700XX: /login errors
  NO_ACCOUNT_FOUND = 70000,
  INCORRECT_PASSWORD = 70001,
  // - - 799XX: /* error
  RESOURCE_NOT_FOUND = 79900,
}

export const clientErrorMessages: ClientErrorCodeMap = {
  // NON-USER RELATED (1XXXX - 5XXXX)
  // - 1XXXX: Contract errors
  [ClientErrorCode.INVALID_REQUEST_BODY]: "Provided request body was invalid.",
  //
  // USER RELATED ERRORS (6XXXX - 9XXXX)
  // - 6XXXX: Authorization errors
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  [ClientErrorCode.FORBIDDEN_ACCESS]:
    "Provided membership doesn't have the necessary permissions to access this resource.",
  // - 7XXXX: Request errors
  // - - 700XX: /login errors
  [ClientErrorCode.NO_ACCOUNT_FOUND]: "No account was found with the provided username.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  // - - 799XX: /* error
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
