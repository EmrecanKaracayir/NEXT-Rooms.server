import { MiddlewareResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IMiddleware } from "../interfaces/IMiddleware";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";

export class CatcherMiddleware implements IMiddleware {
  public static resourceNotFound(
    _req: ExpressRequest,
    res: MiddlewareResponse<null, null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: ExpressNextFunction,
  ): MiddlewareResponse<null, null> | void {
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
