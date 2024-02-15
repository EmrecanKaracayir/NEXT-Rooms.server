import { MiddlewareResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IMiddleware } from "../interfaces/IMiddleware";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { ServerError } from "../schemas/ServerError";
import { ResponseUtil } from "../utils/ResponseUtil";

export class FailureMiddleware implements IMiddleware {
  public static serverFailure(
    error: Error,
    _req: ExpressRequest,
    res: MiddlewareResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: ExpressNextFunction,
  ): MiddlewareResponse | void {
    return ResponseUtil.middlewareResponse(
      res,
      new HttpStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
      new ServerError(error),
      [],
    );
  }
}
