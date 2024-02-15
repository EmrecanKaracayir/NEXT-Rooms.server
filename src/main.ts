import express, { Express } from "express";
import { ConfigConstants } from "./app/constants/ConfigConstants";
import { EnvironmentHelper } from "./app/helpers/EnvironmentHelper";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware";
import { MethodMiddleware } from "./app/middlewares/MethodMiddleware";
import { AccountsBuilder } from "./core/accounts/AccountsBuilder";
import { LoginBuilder } from "./core/login/LoginBuilder";
import { SignupBuilder } from "./core/signup/SignupBuilder";

// App
const app: Express = express();

// Environment
EnvironmentHelper.load();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log);

// Routes without authentication
app.use(
  `${ConfigConstants.API_PREFIX}/${AccountsBuilder.BASE_ROUTE}`,
  new AccountsBuilder().router,
);
app.use(`${ConfigConstants.API_PREFIX}/${LoginBuilder.BASE_ROUTE}`, new LoginBuilder().router);
app.use(`${ConfigConstants.API_PREFIX}/${SignupBuilder.BASE_ROUTE}`, new SignupBuilder().router);

// Post-Middlewares
app.use("*", MethodMiddleware.methodNotAllowed);
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(ConfigConstants.PORT, (): void => {
  console.log(`Server listening on port ${ConfigConstants.PORT}`);
});
