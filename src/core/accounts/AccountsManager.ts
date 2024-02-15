import { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { IManager } from "../../app/interfaces/IManager";
import type { AccountModel } from "../../app/models/AccountModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountsProvider } from "./AccountsProvider";
import type { AccountsRequest } from "./schemas/AccountsRequest";
import { AccountsResponse } from "./schemas/AccountsResponse";

export class AccountsManager implements IManager {
  private readonly mProvider: AccountsProvider;

  constructor() {
    this.mProvider = new AccountsProvider();
  }

  public async getAccount(
    validatedData: AccountsRequest,
  ): Promise<ManagerResponse<AccountsResponse | null>> {
    // Try to get account
    const providerResponse: ProviderResponse<AccountModel | null> = await this.mProvider.getAccount(
      validatedData.username,
    );
    // Check if there were any errors
    if (!providerResponse.data) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    // Return the account
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AccountsResponse.fromModel(providerResponse.data),
    );
  }
}
