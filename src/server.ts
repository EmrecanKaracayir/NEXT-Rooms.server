import dotenv from "dotenv";
import express, { Express } from "express";
import { API_PREFIX, PORT } from "./app/constants/config";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware";
import { LoginBuilder } from "./routes/login/LoginBuilder";

// App
const app: Express = express();

// Environment Variables
dotenv.config();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log);

// Routes without authentication
app.use(`${API_PREFIX}/${LoginBuilder.sPath}`, new LoginBuilder().mRouter);

// Post-Middlewares
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(PORT, (): void => {
  console.log(`Server listening on port ${PORT}`);
});
