import { RawTokenData, Token } from "../../@types/tokens";
import { IModule } from "../../app/interfaces/IModule";
import { TokenGenerator } from "./core/TokenGenerator";
import { TokenVerifier } from "./core/TokenVerifier";

export class AuthModule implements IModule {
  private static sInstance: AuthModule;

  public static get instance(): AuthModule {
    if (!AuthModule.sInstance) {
      AuthModule.sInstance = new AuthModule();
    }
    return AuthModule.sInstance;
  }

  private constructor() {}

  public withData(data: RawTokenData): TokenGenerator {
    return new TokenGenerator(data);
  }

  public withToken(token: Token): TokenVerifier {
    return new TokenVerifier(token);
  }
}
