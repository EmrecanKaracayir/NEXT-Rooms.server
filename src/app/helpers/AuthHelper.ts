import jwt, { Secret } from "jsonwebtoken";
import { AppTokens, AuthPayload } from "../../@types";
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_SECRET_ENV_VARIABLE,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from "../constants/auth";
import { EnvironmentError } from "../schemas/ServerError";

export class AuthHelper {
  public static generateTokens(authPayload: AuthPayload): AppTokens {
    const JWT_SECRET: Secret | undefined = process.env[JWT_SECRET_ENV_VARIABLE];
    if (!JWT_SECRET) {
      throw new EnvironmentError(JWT_SECRET_ENV_VARIABLE);
    }
    const accessToken: string = jwt.sign(authPayload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const refreshToken: string = jwt.sign(authPayload, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  public static verifyToken(token: string): AuthPayload {
    const JWT_SECRET: Secret | undefined = process.env[JWT_SECRET_ENV_VARIABLE];
    if (!JWT_SECRET) {
      throw new EnvironmentError(JWT_SECRET_ENV_VARIABLE);
    }
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  }
}
