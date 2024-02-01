import { Router } from "express";
import { IBuilder } from "../../app/interfaces/IBuilder";
import { SignupController } from "./SignupController";

export class SignupBuilder implements IBuilder {
  public static readonly sPath: string = "signup";

  private readonly mRouter: Router;
  private readonly mController: SignupController;

  constructor() {
    this.mRouter = Router();
    this.mController = new SignupController();
    this.buildRoutes();
  }

  public get router(): Router {
    return this.mRouter;
  }

  private buildRoutes(): void {
    this.mRouter.post("/", this.mController.postSignup.bind(this.mController));
  }
}
