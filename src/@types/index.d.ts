import { NextFunction, Request, Response } from "express";
import { Membership } from "../app/enums/Membership";
import { ClientError, ClientErrorCode } from "../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../app/schemas/HttpStatus";
import { ServerError } from "../app/schemas/ServerError";

export type HttpStatusCodeMap = {
  [key in HttpStatusCode]: string;
};

export type ClientErrorCodeMap = {
  [key in ClientErrorCode]: string;
};

export type AppTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AppRequest = Request;

export type ManagerResponse<D> = {
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
};

export type AppResponse<D, T extends AppTokens | null> = Response<{
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
  tokens: T;
}>;

export type AppNextFunction = NextFunction;

export type AuthPayload = {
  accountId: number;
  membership: Membership;
  sessionId: number;
};
