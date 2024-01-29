export class ServerError {
  public readonly name: string;
  public readonly message: string;
  public readonly stackTrace: string | null;

  constructor(e: Error) {
    this.name = e.name;
    this.message = e.message;
    this.stackTrace = e.stack || null;
  }
}

export class EnvironmentError extends Error {
  constructor(variable: string) {
    super(`Environment variable "${variable}" is not defined. Contact with the developers.`);
    this.name = "EnvironmentError";
  }
}

export class UnexpectedQueryResultError extends Error {
  constructor() {
    super("Query result was unexpected. Contact with the developers.");
    this.name = "UnexpectedQueryResultError";
  }
}

export class ModelMismatchError extends Error {
  constructor(public readonly model: unknown) {
    super(
      `Server and database not agreeing on a model. Model was: \n${JSON.stringify(model, null, 2)}`,
    );
    this.name = "ModelMismatchError";
  }
}
