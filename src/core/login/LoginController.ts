import { ControllerResponse, ManagerResponse } from "../../@types/responses";
import { Tokens } from "../../@types/tokens";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IController } from "../../app/interfaces/IController";
import { ClientError } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { AuthModule } from "../../modules/auth/module";
import { LoginManager } from "./LoginManager";
import { LoginResponse } from "./schemas/LoginResponse";

export class LoginController implements IController {
  private readonly mManager: LoginManager;

  constructor() {
    this.mManager = new LoginManager();
  }

  public async postLogin(
    req: ExpressRequest,
    res: ControllerResponse<LoginResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<LoginResponse | null, Tokens | null> | void> {
    // Response declaration
    const clientErrors: Array<ClientError> = [];
    // Logic
    try {
      // Validate request
      if (LoginRequestValidator.instance.isValidRequest(clientErrors, req.body)) {
        const httpStatus: HttpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        return res.status(httpStatus.code).send({
          httpStatus: httpStatus,
          serverError: null,
          clientErrors: clientErrors,
          data: null,
          tokens: null,
        });
      }
      // Hand over to manager
      const managerResponse: ManagerResponse<LoginResponse | null> = await this.mManager.postLogin(
        req.body,
        clientErrors,
      );
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
        tokens: await AuthModule.instance
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
