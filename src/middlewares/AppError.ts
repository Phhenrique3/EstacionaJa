import { Response } from "express";

export class AppError extends Error {
  public status: number;

  constructor(
    mensagem: string = "Erro interno no servidor",
    status: number = 500
  ) {
    super(mensagem);

    this.name = "AppError";
    this.status = status;
  }

  EnviaResposta(res: Response): void {
    res.status(this.status).json({
      mensagem: this.message,
      status: this.status,
    });
  }
}

export default AppError