import { RawTokenData, Tokens } from "../../../@types/tokens";
import { SessionHandler } from "./SessionHandler";

export class TokenGenerator {
  private readonly mData: RawTokenData;

  public constructor(data: RawTokenData) {
    this.mData = data;
  }

  public async generateTokens(): Promise<Tokens> {
    return await SessionHandler.createOrUpdateSession(this.mData);
  }
}
