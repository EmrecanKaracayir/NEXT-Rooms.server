import { ManagerResponse } from "../../@types";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { LoginProvider } from "./LoginProvider";
import { AccountModel } from "./models/AccountModel";
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
    const model: AccountModel | null = await this.mProvider.getAccount(req.username);
    if (!model) {
      clientErrors.push(new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND));
      return {
        httpStatus: new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        serverError: null,
        clientErrors: clientErrors,
        data: null,
      };
    }
    if (!(await EncryptionHelper.compare(req.password, model.password))) {
      clientErrors.push(new ClientError(ClientErrorCode.INCORRECT_PASSWORD));
      return {
        httpStatus: new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        serverError: null,
        clientErrors: clientErrors,
        data: null,
      };
    }
    return {
      httpStatus: new HttpStatus(HttpStatusCode.OK),
      serverError: null,
      clientErrors: clientErrors,
      data: LoginResponse.fromModel(model),
    };
  }
}
