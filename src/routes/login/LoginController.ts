import { AppNextFunction, AppRequest, AppResponse, AppTokens, ManagerResponse } from "../../@types";
import { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { LoginManager } from "./LoginManager";
import { LoginRequest } from "./schemas/LoginRequest";
import { LoginResponse } from "./schemas/LoginResponse";

export class LoginController implements IController {
  private readonly mManager: LoginManager;

  constructor() {
    this.mManager = new LoginManager();
  }

  public async postLogin(
    req: AppRequest,
    res: AppResponse<LoginResponse | null, AppTokens | null>,
    next: AppNextFunction,
  ): Promise<AppResponse<LoginResponse | null, AppTokens | null> | void> {
    // Response declaration
    const clientErrors: Array<ClientError> = [];
    // Logic
    try {
      if (!LoginRequest.isValidReq(req.body)) {
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
      // Hand over to service
      const serviceRes: ManagerResponse<LoginResponse | null> = await this.mManager.postLogin(
        req.body as LoginRequest,
        clientErrors,
      );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send({
          httpStatus: serviceRes.httpStatus,
          serverError: serviceRes.serverError,
          clientErrors: serviceRes.clientErrors,
          data: null,
          tokens: null,
        });
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send({
        httpStatus: serviceRes.httpStatus,
        serverError: serviceRes.serverError,
        clientErrors: serviceRes.clientErrors,
        data: serviceRes.data,
        tokens: {
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}
