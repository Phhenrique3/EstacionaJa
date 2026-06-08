import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

function normalizePlate(placa: string): string {
  return placa.replace("-", "").trim().toUpperCase();
}

export function RegisterVehicleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { placa, marca, modelo, cor, clientId, categoryId } = req.body;

  if (!placa || !clientId || !categoryId) {
    throw new AppError("Placa, cliente e categoria são obrigatórios", 400);
  }

  if (typeof placa !== "string") {
    throw new AppError("Placa deve ser um texto", 400);
  }

  if (typeof clientId !== "string") {
    throw new AppError("ID do cliente deve ser um texto", 400);
  }

  if (typeof categoryId !== "string") {
    throw new AppError("ID da categoria deve ser um texto", 400);
  }

  const placaNormalized = normalizePlate(placa);

  if (placaNormalized.length !== 7) {
    throw new AppError("Placa deve ter 7 caracteres", 400);
  }

  let marcaNormalized: string | undefined;
  let modeloNormalized: string | undefined;
  let corNormalized: string | undefined;

  if (marca !== undefined && marca !== null && marca !== "") {
    if (typeof marca !== "string") {
      throw new AppError("Marca deve ser um texto", 400);
    }

    marcaNormalized = marca.trim();
  }

  if (modelo !== undefined && modelo !== null && modelo !== "") {
    if (typeof modelo !== "string") {
      throw new AppError("Modelo deve ser um texto", 400);
    }

    modeloNormalized = modelo.trim();
  }

  if (cor !== undefined && cor !== null && cor !== "") {
    if (typeof cor !== "string") {
      throw new AppError("Cor deve ser um texto", 400);
    }

    corNormalized = cor.trim();
  }

  req.body = {
    placa: placaNormalized,
    marca: marcaNormalized,
    modelo: modeloNormalized,
    cor: corNormalized,
    clientId: clientId.trim(),
    categoryId: categoryId.trim(),
  };

  return next();
}