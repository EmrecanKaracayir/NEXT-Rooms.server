import { Router } from "express";
import { IBuilder } from "../../app/interfaces/IBuilder";
import { LoginController } from "./LoginController";

export class LoginBuilder implements IBuilder {
  public static readonly sPath: string = "login";

  private readonly mRouter: Router;
  private readonly mController: LoginController;

  constructor() {
    this.mRouter = Router();
    this.mController = new LoginController();
    this.buildRoutes();
  }

  public get router(): Router {
    return this.mRouter;
  }

  private buildRoutes(): void {
    this.mRouter.post("/", this.mController.postLogin.bind(this.mController));
  }
}
