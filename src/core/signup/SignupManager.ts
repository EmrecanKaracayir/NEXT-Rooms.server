import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import { IManager } from "../../app/interfaces/IManager";
import { AccountRules } from "../../app/rules/AccountRules";
import { SessionRules } from "../../app/rules/SessionRules";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { StringUtil } from "../../app/utils/StringUtil";
import { SignupProvider } from "./SignupProvider";
import { SignupModel } from "./models/SignupModel";
import { SignupRequest } from "./schemas/SignupRequest";
import { SignupResponse } from "./schemas/SignupResponse";

export class SignupManager implements IManager {
  private readonly mProvider: SignupProvider;

  constructor() {
    this.mProvider = new SignupProvider();
  }

  public async postSignup(
    req: SignupRequest,
    clientErrors: ClientError[],
  ): Promise<ManagerResponse<SignupResponse | null>> {
    // Validate fields
    this.validateFields(clientErrors, req.sessionKey, req.username, req.password);
    // Check if there were any errors
    if (clientErrors.length > 0) {
      return {
        httpStatus: new HttpStatus(HttpStatusCode.BAD_REQUEST),
        serverError: null,
        clientErrors: clientErrors,
        data: null,
      };
    }
    // Check if account with username already exists
    if ((await this.mProvider.doesAccountExist(req.username)).data) {
      clientErrors.push(new ClientError(ClientErrorCode.ACCOUNT_ALREADY_EXISTS));
      return {
        httpStatus: new HttpStatus(HttpStatusCode.CONFLICT),
        serverError: null,
        clientErrors: clientErrors,
        data: null,
      };
    }
    // Create account
    const providerResponse: ProviderResponse<SignupModel> = await this.mProvider.createAccount(
      req.username,
      await EncryptionHelper.encrypt(req.password),
    );
    return {
      httpStatus: new HttpStatus(HttpStatusCode.CREATED),
      serverError: null,
      clientErrors: clientErrors,
      data: SignupResponse.fromModel(providerResponse.data),
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
      !StringUtil.isInLengthRange(
        sessionKey,
        SessionRules.SESSION_KEY_MIN_LENGTH,
        SessionRules.SESSION_KEY_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_KEY_LENGTH));
    }
    if (!StringUtil.matchesRegex(sessionKey, SessionRules.SESSION_KEY_REGEX)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_KEY_CONTENT));
    }
    // Username validation
    if (
      !StringUtil.isInLengthRange(
        username,
        AccountRules.USERNAME_MIN_LENGTH,
        AccountRules.USERNAME_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.SIGNUP_INVALID_USERNAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(username, AccountRules.USERNAME_REGEX)) {
      clientErrors.push(new ClientError(ClientErrorCode.SIGNUP_INVALID_USERNAME_CONTENT));
    }
    // Password validation
    if (
      !StringUtil.isInLengthRange(
        password,
        AccountRules.PASSWORD_MIN_LENGTH,
        AccountRules.PASSWORD_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.SIGNUP_INVALID_PASSWORD_LENGTH));
    }
    if (!StringUtil.matchesRegex(password, AccountRules.PASSWORD_REGEX)) {
      clientErrors.push(new ClientError(ClientErrorCode.SIGNUP_INVALID_PASSWORD_CONTENT));
    }
  }
}
