import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
import { IHelper } from "../interfaces/IHelper";

export class EnvironmentHelper implements IHelper {
  private static sInstance: EnvironmentHelper;

  // Variable names
  private static readonly JWT_SECRET_KEY: string = "LUFHJFJnXjk2KUk3";
  private static readonly POOL_PASSWORD_KEY: string = "bDkxWGohQiN1RD0h";

  public static load(): EnvironmentHelper {
    if (!EnvironmentHelper.sInstance) {
      dotenv.config();
      EnvironmentHelper.sInstance = new EnvironmentHelper();
    }
    return EnvironmentHelper.sInstance;
  }

  public static get(): EnvironmentHelper {
    return EnvironmentHelper.load();
  }

  private readonly mJwtSecret: Secret;
  public get jwtSecret(): Secret {
    return this.mJwtSecret;
  }

  private readonly mPoolPassword: string;
  public get poolPassword(): string {
    return this.mPoolPassword;
  }

  private constructor() {
    this.mJwtSecret = this.loadJwtSecret();
    this.mPoolPassword = this.loadPoolPassword();
  }

  private loadJwtSecret(): Secret {
    const encodedJwtSecret: Secret | undefined = process.env[EnvironmentHelper.JWT_SECRET_KEY];
    if (!encodedJwtSecret) {
      throw new Error(`Environment variable "${EnvironmentHelper.JWT_SECRET_KEY}" is not defined!`);
    }
    return Buffer.from(encodedJwtSecret, "base64url").toString("utf8");
  }

  private loadPoolPassword(): string {
    const encodedPoolPassword: string | undefined =
      process.env[EnvironmentHelper.POOL_PASSWORD_KEY];
    if (!encodedPoolPassword) {
      throw new Error(
        `Environment variable "${EnvironmentHelper.POOL_PASSWORD_KEY}" is not defined!`,
      );
    }
    return Buffer.from(encodedPoolPassword, "base64url").toString("utf8");
  }
}
