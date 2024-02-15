import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { LoginProvider } from "./LoginProvider";
import { LoginAdapter } from "./adapters/LoginAdapter";
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
      data: LoginAdapter.instance.modelToResponse(providerResponse.data),
    };
  }
}
