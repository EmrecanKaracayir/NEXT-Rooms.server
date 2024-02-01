import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Token, TokenPayload } from "../../../@types/tokens";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import { PayloadHelper } from "../app/helpers/PayloadHelper";
import { AccountHandler } from "./AccountHandler";
import { SessionHandler } from "./SessionHandler";

export class TokenVerifier {
  private readonly mToken: Token;

  public constructor(token: Token) {
    this.mToken = token;
  }

  public async verify(isRefreshToken: boolean = false): Promise<boolean> {
    const JWT_SECRET: Secret = EnvironmentHelper.get().jwtSecret;
    const payload: JwtPayload | string = jwt.verify(this.mToken, JWT_SECRET);
    if (!PayloadHelper.isValidPayload(payload)) {
      return false;
    }
    const accountVerified: boolean = await AccountHandler.verifyAccount(payload);
    if (!isRefreshToken) {
      return accountVerified;
    } else {
      const sessionVerified: boolean = await SessionHandler.verifySession(this.mToken, payload);
      return accountVerified && sessionVerified;
    }
  }

  public getPayload(): TokenPayload {
    const JWT_SECRET: Secret = EnvironmentHelper.get().jwtSecret;
    // Since we already verified the token in the middleware, we can safely cast to TokenPayload
    return jwt.verify(this.mToken, JWT_SECRET) as TokenPayload;
  }
}
