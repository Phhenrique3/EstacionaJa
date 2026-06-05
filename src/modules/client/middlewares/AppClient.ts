import AppError from "../../users/middlewares/AppError";

export class AppClient extends AppError {
  public readonly statusCode: number;

  constructor(
    message: string = "Erro interno no servidor",
    statusCode: number = 500
  ) {
    super(message, statusCode);

    this.name = "AppClient";
    this.statusCode = statusCode;
  }
}

export default AppClient;