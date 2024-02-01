import { Membership } from "../app/enums/Membership";

export type Token = string;

export type Tokens = {
  accessToken: Token;
  refreshToken: Token;
};

export type TokenPayload = {
  accountId: number;
  membership: Membership;
  sessionId: number;
};

export type RawTokenData = {
  accountId: number;
  membership: Membership;
  sessionKey: string;
};
