import { ClientErrorCodeMap } from "../../@types/maps";
import { IResponse } from "../interfaces/IResponse";
import { AccountRules } from "../rules/AccountRules";

export class ClientError implements IResponse {
  public readonly code: number;
  public readonly message: string;

  constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}

export enum ClientErrorCode {
  // FRONTEND ERRORS (1XXXX - 3XXXX)
  //  *  1XXXX: Schema errors
  INVALID_REQUEST_BODY = 10000,

  // AUTHORIZATION ERRORS (4XXXX - 6XXXX)
  //  *  4XXXX: Token errors
  INVALID_TOKEN = 40000,
  EXPIRED_TOKEN = 40001,
  //  *  5XXXX: Session errors
  INVALID_SESSION_KEY = 50000,
  //  *  6XXXX: Access errors
  FORBIDDEN_ACCESS = 60000,

  // REQUEST ERRORS (7XXXX - 9XXXX)
  //  *  7XXXX: Route errors
  //  *  *  700XX: /login errors
  LOGIN_INVALID_USERNAME_LENGTH = 70000,
  LOGIN_INVALID_USERNAME_CONTENT = 70001,
  LOGIN_INVALID_PASSWORD_LENGTH = 70002,
  LOGIN_INVALID_PASSWORD_CONTENT = 70003,
  NO_ACCOUNT_FOUND = 70004,
  INCORRECT_PASSWORD = 70005,
  //  *  *  701XX: /signup errors
  SIGNUP_INVALID_USERNAME_LENGTH = 70100,
  SIGNUP_INVALID_USERNAME_CONTENT = 70101,
  SIGNUP_INVALID_PASSWORD_LENGTH = 70102,
  SIGNUP_INVALID_PASSWORD_CONTENT = 70103,
  ACCOUNT_ALREADY_EXISTS = 70104,
  //  *  *  799XX: /* errors
  RESOURCE_NOT_FOUND = 79900,
}

export const clientErrorMessages: ClientErrorCodeMap<string> = {
  // FRONTEND ERRORS (1XXXX - 3XXXX)
  //  *  1XXXX: Schema errors
  [ClientErrorCode.INVALID_REQUEST_BODY]: "Provided request body was invalid.",

  // AUTHORIZATION ERRORS (4XXXX - 6XXXX)
  //  *  4XXXX: Token errors
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  //  *  5XXXX: Session errors
  [ClientErrorCode.INVALID_SESSION_KEY]: "Provided session key was invalid.",
  //  *  6XXXX: Access errors
  [ClientErrorCode.FORBIDDEN_ACCESS]:
    "Provided membership doesn't have the necessary permissions to access this resource.",

  // REQUEST ERRORS (7XXXX - 9XXXX)
  //  *  7XXXX: Route errors
  //  *  *  700XX: /login errors
  [ClientErrorCode.LOGIN_INVALID_USERNAME_LENGTH]: `Provided username wasn't in the length range of ${AccountRules.USERNAME_MIN_LENGTH} to ${AccountRules.USERNAME_MAX_LENGTH}.`,
  [ClientErrorCode.LOGIN_INVALID_USERNAME_CONTENT]:
    "Provided username contained forbidden characters.",
  [ClientErrorCode.LOGIN_INVALID_PASSWORD_LENGTH]: `Provided password wasn't in the length range of ${AccountRules.PASSWORD_MIN_LENGTH} to ${AccountRules.PASSWORD_MAX_LENGTH}.`,
  [ClientErrorCode.LOGIN_INVALID_PASSWORD_CONTENT]:
    "Provided password didn't satisfy the requirements. A password must contain at least one lowercase letter, one uppercase letter, one digit and one special character.",
  [ClientErrorCode.NO_ACCOUNT_FOUND]: "No account was found with the provided username.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  //  *  *  701XX: /signup errors
  [ClientErrorCode.SIGNUP_INVALID_USERNAME_LENGTH]: `Provided username wasn't in the length range of ${AccountRules.USERNAME_MIN_LENGTH} to ${AccountRules.USERNAME_MAX_LENGTH}.`,
  [ClientErrorCode.SIGNUP_INVALID_USERNAME_CONTENT]:
    "Provided username contained forbidden characters.",
  [ClientErrorCode.SIGNUP_INVALID_PASSWORD_LENGTH]: `Provided password wasn't in the length range of ${AccountRules.PASSWORD_MIN_LENGTH} to ${AccountRules.PASSWORD_MAX_LENGTH}.`,
  [ClientErrorCode.SIGNUP_INVALID_PASSWORD_CONTENT]:
    "Provided password didn't satisfy the requirements. A password must contain at least one lowercase letter, one uppercase letter, one digit and one special character.",
  [ClientErrorCode.ACCOUNT_ALREADY_EXISTS]: "An account already exists with the provided username.",
  //  *  *  799XX: /* errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
