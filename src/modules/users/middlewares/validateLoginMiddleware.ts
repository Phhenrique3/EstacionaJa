import { NextFunction, Request, Response } from "express";
import AppError from "../middlewares/AppError";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateLoginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email e senha são obrigatórios", 400);
  }

  if (typeof email !== "string") {
    throw new AppError("Email deve ser um texto", 400);
  }

  const emailTrimmed = email.trim().toLowerCase();

  if (!isValidEmail(emailTrimmed)) {
    throw new AppError("Email inválido", 400);
  }

  if (typeof password !== "string") {
    throw new AppError("Senha deve ser um texto", 400);
  }

  req.body = {
    email: emailTrimmed,
    password,
  };

  return next();
}