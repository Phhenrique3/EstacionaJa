import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

export function validateVehicleCategoryMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, description } = req.body;

  if (!name) {
    throw new AppError("Nome da categoria é obrigatório", 400);
  }

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



  let descriptionTrimmed: string | undefined;

  if (description !== undefined && description !== null && description !== "") {
    if (typeof description !== "string") {
      throw new AppError("Descrição deve ser um texto", 400);
    }

    descriptionTrimmed = description.trim();
  }

  req.body = {
    name: nameTrimmed,
    description: descriptionTrimmed,
  };

  return next();
}