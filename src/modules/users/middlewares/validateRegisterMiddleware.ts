import { NextFunction, Request, Response } from "express";
import AppError from "../middlewares/AppError";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  return nameRegex.test(name);
}

export function validateRegisterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("name, email e password são obrigatórios", 400);
  }

  if (typeof name !== "string") {
    throw new AppError("name deve ser um texto", 400);
  }

  const nameTrimmed = name.trim();

  if (nameTrimmed.length < 3) {
    throw new AppError("name precisa ter no mínimo 3 caracteres", 400);
  }

  if (!isValidName(nameTrimmed)) {
    throw new AppError("name deve conter apenas letras e espaços", 400);
  }

  if (typeof email !== "string") {
    throw new AppError("email deve ser um texto", 400);
  }

  const emailTrimmed = email.trim().toLowerCase();

  if (!isValidEmail(emailTrimmed)) {
    throw new AppError("email inválido", 400);
  }

  if (typeof password !== "string") {
    throw new AppError("password deve ser um texto", 400);
  }

  if (password.length < 6) {
    throw new AppError("password precisa ter no mínimo 6 caracteres", 400);
  }

  req.body = {
    name: nameTrimmed,
    email: emailTrimmed,
    password,
  };

  return next();
}