import { AppNextFunction, AppRequest, AppResponse } from "../../@types";

export class LoggerMiddleware {
  public static log(req: AppRequest, _res: AppResponse<null, null>, next: AppNextFunction): void {
    console.log(`Received a ${req.method} request on ${req.url} at ${new Date().toISOString()}`);
    return next();
  }
}
