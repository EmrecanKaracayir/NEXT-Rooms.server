import { MiddlewareResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IMiddleware } from "../interfaces/IMiddleware";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { ResponseUtil } from "../utils/ResponseUtil";

export class CatcherMiddleware implements IMiddleware {
  public static resourceNotFound(
    _req: ExpressRequest,
    res: MiddlewareResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: ExpressNextFunction,
  ): MiddlewareResponse | void {
    return ResponseUtil.middlewareResponse(res, new HttpStatus(HttpStatusCode.NOT_FOUND), null, [
      new ClientError(ClientErrorCode.RESOURCE_NOT_FOUND),
    ]);
  }
}
