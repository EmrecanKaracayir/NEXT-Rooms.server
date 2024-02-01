import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
import { IHelper } from "../interfaces/IHelper";

export class EnvironmentHelper implements IHelper {
  private static sInstance: EnvironmentHelper;

  // Variable names
  private static readonly JWT_SECRET_KEY: string = "SldUX1NFQ1JFVA";

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

  private constructor() {
    this.mJwtSecret = this.loadJwtSecret();
  }

  private loadJwtSecret(): Secret {
    const encodedJwtSecret: Secret | undefined = process.env[EnvironmentHelper.JWT_SECRET_KEY];
    if (!encodedJwtSecret) {
      throw new Error(`Environment variable "${EnvironmentHelper.JWT_SECRET_KEY}" is not defined!`);
    }
    return Buffer.from(encodedJwtSecret, "base64").toString("ascii");
  }
}
