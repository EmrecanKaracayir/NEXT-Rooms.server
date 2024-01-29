import { AppNextFunction, AppRequest, AppResponse } from "../../@types";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";

export class CatcherMiddleware {
  public static resourceNotFound(
    _req: AppRequest,
    res: AppResponse<null, null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: AppNextFunction,
  ): AppResponse<null, null> | void {
    // Response declaration
    const httpStatus: HttpStatus = new HttpStatus(HttpStatusCode.NOT_FOUND);
    // Logic
    return res.status(httpStatus.code).send({
      httpStatus: httpStatus,
      serverError: null,
      clientErrors: [new ClientError(ClientErrorCode.RESOURCE_NOT_FOUND)],
      data: null,
      tokens: null,
    });
  }
}
