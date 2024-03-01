import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import { IManager } from "../../app/interfaces/IManager";
import type { AccountModel } from "../../app/models/AccountModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { SignupProvider } from "./SignupProvider";
import type { SignupRequest } from "./schemas/SignupRequest";
import { SignupResponse } from "./schemas/SignupResponse";

export class SignupManager implements IManager {
  private readonly mProvider: SignupProvider;

  constructor() {
    this.mProvider = new SignupProvider();
  }

  public async postSignup(
    validatedData: SignupRequest,
  ): Promise<ManagerResponse<SignupResponse | null>> {
    // Check if account with username already exists
    if ((await this.mProvider.doesAccountExist(validatedData.username)).data) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_ALREADY_EXISTS)],
        null,
      );
    }
    // Account not found, create one
    const providerResponse: ProviderResponse<AccountModel> = await this.mProvider.createAccount(
      validatedData.username,
      await EncryptionHelper.encrypt(validatedData.password),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      SignupResponse.fromModel(providerResponse.data),
    );
  }
}
