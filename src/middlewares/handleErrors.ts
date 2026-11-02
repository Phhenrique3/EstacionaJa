import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import { Logger } from "../config/error/logger";

export default function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = error instanceof AppError ? error.statusCode : 500;

  Logger.error("Erro de aplicação", {
    mensagem: error.message,
    status,
    metodo: req.method,
    rota: req.originalUrl,
    nomeErro: error.name,
    stack: error.stack,
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      mensagem: error.message,
      status: error.statusCode,
    });
  }

  console.error(error);

  return res.status(500).json({
    mensagem: "Erro interno no servidor",
    status: 500,
  });
}
