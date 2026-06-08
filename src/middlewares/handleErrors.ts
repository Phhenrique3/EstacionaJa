import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";

export default function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
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