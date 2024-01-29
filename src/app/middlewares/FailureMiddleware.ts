import { AppNextFunction, AppRequest, AppResponse } from "../../@types";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { ServerError } from "../schemas/ServerError";

export class FailureMiddleware {
  public static serverFailure(
    error: Error,
    _req: AppRequest,
    res: AppResponse<null, null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: AppNextFunction,
  ): AppResponse<null, null> | void {
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
