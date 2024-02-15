import { NextFunction, Request, Response, type Application, type Router } from "express";

export type ExpressApplication = Application;

export type ExpressRouter = Router;

export type ExpressRequest = Request;

export type ExpressResponse<T> = Response<T>;

export type ExpressNextFunction = NextFunction;
