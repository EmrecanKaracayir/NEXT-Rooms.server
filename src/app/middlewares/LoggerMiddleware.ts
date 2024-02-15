import { MiddlewareResponse } from "../../@types/responses";
import { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { IMiddleware } from "../interfaces/IMiddleware";

export class LoggerMiddleware implements IMiddleware {
  public static log(
    req: ExpressRequest,
    _res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): void {
    console.log(`Received a ${req.method} request on ${req.url} at ${new Date().toISOString()}`);
    return next();
  }
}
