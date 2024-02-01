import { NextFunction, Request, Response } from "express";

export type ExpressRequest = Request;

export type ExpressResponse<T> = Response<T>;

export type ExpressNextFunction = NextFunction;
