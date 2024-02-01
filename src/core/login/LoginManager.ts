import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import { IManager } from "../../app/interfaces/IManager";
import { AccountRules } from "../../app/rules/AccountRules";
import { SessionRules } from "../../app/rules/SessionRules";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { StringUtils } from "../../app/utils/StringUtils";
import { LoginProvider } from "./LoginProvider";
import { LoginModel } from "./models/LoginModel";
import { LoginRequest } from "./schemas/LoginRequest";
import { LoginResponse } from "./schemas/LoginResponse";

export class LoginManager implements IManager {
  private readonly mProvider: LoginProvider;

  constructor() {
    this.mProvider = new LoginProvider();
  }

  public async postLogin(
    req: LoginRequest,
    clientErrors: ClientError[],
  ): Promise<ManagerResponse<LoginResponse | null>> {
    // Validate fields
    this.validateFields(clientErrors, req.sessionKey, req.username, req.password);
    if (clientErrors.length > 0) {
      return {
        httpStatus: new HttpStatus(HttpStatusCode.BAD_REQUEST),
        serverError: null,
        clientErrors: clientErrors,
        data: null,
      };
    }
    // Try to get account
    const providerResponse: ProviderResponse<LoginModel | null> = await this.mProvider.getAccount(
      req.username,
    );
    // Check if there were any errors
    if (!providerResponse.data) {
      clientErrors.push(new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND));
      return {
        httpStatus: new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        serverError: null,
        clientErrors: clientErrors,
        data: null,
      };
    }
    // Compare passwords
    if (!(await EncryptionHelper.compare(req.password, providerResponse.data.password))) {
      // Passwords don't match
      clientErrors.push(new ClientError(ClientErrorCode.INCORRECT_PASSWORD));
      return {
        httpStatus: new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        serverError: null,
        clientErrors: clientErrors,
        data: null,
      };
    }
    // Passwords match
    return {
      httpStatus: new HttpStatus(HttpStatusCode.OK),
      serverError: null,
      clientErrors: clientErrors,
      data: LoginResponse.fromModel(providerResponse.data),
    };
  }

  private validateFields(
    clientErrors: ClientError[],
    sessionKey: string,
    username: string,
    password: string,
  ): void {
    // SessionKey validation
    if (
      !StringUtils.isInLengthRange(
        sessionKey,
        SessionRules.SESSION_KEY_MIN_LENGTH,
        SessionRules.SESSION_KEY_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_KEY));
    }
    // Username validation
    if (
      !StringUtils.isInLengthRange(
        username,
        AccountRules.USERNAME_MIN_LENGTH,
        AccountRules.USERNAME_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.LOGIN_INVALID_USERNAME_LENGTH));
    }
    if (!StringUtils.matchesRegex(username, AccountRules.USERNAME_REGEX)) {
      clientErrors.push(new ClientError(ClientErrorCode.LOGIN_INVALID_USERNAME_CONTENT));
    }
    // Password validation
    if (
      !StringUtils.isInLengthRange(
        password,
        AccountRules.PASSWORD_MIN_LENGTH,
        AccountRules.PASSWORD_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.LOGIN_INVALID_PASSWORD_LENGTH));
    }
    if (!StringUtils.matchesRegex(password, AccountRules.PASSWORD_REGEX)) {
      clientErrors.push(new ClientError(ClientErrorCode.LOGIN_INVALID_PASSWORD_CONTENT));
    }
  }
}
