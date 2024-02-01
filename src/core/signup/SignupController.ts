import { ControllerResponse, ManagerResponse } from "../../@types/responses";
import { Tokens } from "../../@types/tokens";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { AuthModule } from "../../modules/auth/main";
import { SignupManager } from "./SignupManager";
import { SignupRequest } from "./schemas/SignupRequest";
import { SignupResponse } from "./schemas/SignupResponse";

export class SignupController implements IController {
  private readonly mManager: SignupManager;

  constructor() {
    this.mManager = new SignupManager();
  }

  public async postSignup(
    req: ExpressRequest,
    res: ControllerResponse<SignupResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<SignupResponse | null, Tokens | null> | void> {
    // Response declaration
    const clientErrors: Array<ClientError> = [];
    // Logic
    try {
      // Validate request body
      if (!SignupRequest.isValidReq(req.body)) {
        const httpStatus: HttpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(new ClientError(ClientErrorCode.INVALID_REQUEST_BODY));
        return res.status(httpStatus.code).send({
          httpStatus: httpStatus,
          serverError: null,
          clientErrors: clientErrors,
          data: null,
          tokens: null,
        });
      }
      // Hand over to manager
      const managerResponse: ManagerResponse<SignupResponse | null> =
        await this.mManager.postSignup(req.body, clientErrors);
      // Check if there were any errors
      if (!managerResponse.httpStatus.isSuccess() || !managerResponse.data) {
        // Respond without token
        return res.status(managerResponse.httpStatus.code).send({
          httpStatus: managerResponse.httpStatus,
          serverError: managerResponse.serverError,
          clientErrors: managerResponse.clientErrors,
          data: null,
          tokens: null,
        });
      }
      // Respond with token
      return res.status(managerResponse.httpStatus.code).send({
        httpStatus: managerResponse.httpStatus,
        serverError: managerResponse.serverError,
        clientErrors: managerResponse.clientErrors,
        data: managerResponse.data,
        tokens: await AuthModule.get()
          .withData({
            accountId: managerResponse.data.accountId,
            membership: managerResponse.data.membership,
            sessionKey: req.body.sessionKey,
          })
          .generateTokens(),
      });
    } catch (error) {
      return next(error);
    }
  }
}
