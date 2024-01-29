import { Router } from "express";
import { IBuilder } from "../../app/interfaces/IBuilder";
import { LoginController } from "./LoginController";

export class LoginBuilder implements IBuilder {
  public static readonly sPath: string = "login";

  public readonly mRouter: Router;
  private readonly mController: LoginController;

  constructor() {
    this.mRouter = Router();
    this.mController = new LoginController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    this.mRouter.post("/", this.mController.postLogin.bind(this.mController));
  }
}
