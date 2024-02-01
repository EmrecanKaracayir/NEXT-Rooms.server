import { MiddlewareResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IMiddleware } from "../interfaces/IMiddleware";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { ServerError } from "../schemas/ServerError";

export class FailureMiddleware implements IMiddleware {
  public static serverFailure(
    error: Error,
    _req: ExpressRequest,
    res: MiddlewareResponse<null, null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: ExpressNextFunction,
  ): MiddlewareResponse<null, null> | void {
    // Response declaration
    const httpStatus: HttpStatus = new HttpStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
    // Logic
    console.error(error.stack);
    return res.status(httpStatus.code).send({
      httpStatus: httpStatus,
      serverError: new ServerError(error),
      clientErrors: [],
      data: null,
      tokens: null,
    });
  }
}
