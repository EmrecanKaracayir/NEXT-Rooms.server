import { Router } from "express";

export interface IBuilder {
  get router(): Router;
}
