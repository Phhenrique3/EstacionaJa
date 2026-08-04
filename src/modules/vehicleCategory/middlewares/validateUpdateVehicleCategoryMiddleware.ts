import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

export function validateUpdateVehicleCategoryMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, description, active } = req.body;

  const data: {
    name?: string;
    description?: string;
    active?: boolean;
  } = {};

  if (name !== undefined) {
    if (typeof name !== "string") {
      throw new AppError("Nome da categoria deve ser um texto", 400);
    }

    const nameTrimmed = name.trim();

    if (nameTrimmed.length < 2) {
      throw new AppError(
        "Nome da categoria precisa ter no mínimo 2 caracteres",
        400
      );
    }

    if (/\d/.test(nameTrimmed)) {
      throw new AppError("Nome da categoria não pode conter números", 400);
    }

    data.name = nameTrimmed;
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new AppError("Descrição deve ser um texto", 400);
    }

    data.description = description.trim();
  }

  if (active !== undefined) {
    if (typeof active !== "boolean") {
      throw new AppError("Active deve ser true ou false", 400);
    }

    data.active = active;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("Informe ao menos um campo para atualizar", 400);
  }

  req.body = data;

  return next();
}