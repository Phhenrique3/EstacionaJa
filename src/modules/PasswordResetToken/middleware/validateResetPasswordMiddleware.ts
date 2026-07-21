import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

export function validateResetPasswordMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    throw new AppError("E-mail, código e nova senha são obrigatórios", 400);
  }

  if (typeof email !== "string") {
    throw new AppError("E-mail deve ser um texto", 400);
  }

  if (typeof token !== "string") {
    throw new AppError("Código deve ser um texto", 400);
  }

  if (typeof newPassword !== "string") {
    throw new AppError("Nova senha deve ser um texto", 400);
  }

  if (newPassword.trim().length < 6) {
    throw new AppError("Nova senha deve ter pelo menos 6 caracteres", 400);
  }

  req.body = {
    email: email.trim().toLowerCase(),
    token: token.trim(),
    newPassword: newPassword.trim(),
  };

  return next();
}