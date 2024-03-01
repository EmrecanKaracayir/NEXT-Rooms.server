import { RawTokenData, Tokens } from "../../../@types/tokens";
import type { IGenerator } from "../app/interfaces/IGenerator";
import { SessionHandler } from "./SessionHandler";

export class TokenGenerator implements IGenerator {
  private readonly mData: RawTokenData;

  public constructor(data: RawTokenData) {
    this.mData = data;
  }

  public async generateTokens(): Promise<Tokens> {
    return (await SessionHandler.createOrUpdateSession(this.mData)).data;
  }
}
