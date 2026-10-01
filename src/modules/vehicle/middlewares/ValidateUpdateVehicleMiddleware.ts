import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

function normalizePlate(placa: string): string {
  return placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

export function validateUpdateVehicleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { placa, marca, modelo, cor, clientId, categoryId } = req.body;

  const data: {
    placa?: string;
    marca?: string;
    modelo?: string;
    cor?: string;
    clientId?: string;
    categoryId?: string;
  } = {};

  if (placa !== undefined) {
    if (typeof placa !== "string") {
      throw new AppError("Placa deve ser um texto", 400);
    }

    const placaNormalized = normalizePlate(placa);

    if (placaNormalized.length !== 6) {
      throw new AppError("Placa deve conter 7 caracteres", 400);
    }

    data.placa = placaNormalized;
  }

  if (marca !== undefined) {
    if (typeof marca !== "string") {
      throw new AppError("Marca deve ser um texto", 400);
    }

    data.marca = marca.trim();
  }

  if (modelo !== undefined) {
    if (typeof modelo !== "string") {
      throw new AppError("Modelo deve ser um texto", 400);
    }

    data.modelo = modelo.trim();
  }

  if (cor !== undefined) {
    if (typeof cor !== "string") {
      throw new AppError("Cor deve ser um texto", 400);
    }

    data.cor = cor.trim();
  }

  if (clientId !== undefined) {
    if (typeof clientId !== "string") {
      throw new AppError("ID do cliente deve ser um texto", 400);
    }

    const clientIdTrimmed = clientId.trim();

    if (!clientIdTrimmed) {
      throw new AppError("ID do cliente não pode ser vazio", 400);
    }

    data.clientId = clientIdTrimmed;
  }

  if (categoryId !== undefined) {
    if (typeof categoryId !== "string") {
      throw new AppError("ID da categoria deve ser um texto", 400);
    }

    const categoryIdTrimmed = categoryId.trim();

    if (!categoryIdTrimmed) {
      throw new AppError("ID da categoria não pode ser vazio", 400);
    }

    data.categoryId = categoryIdTrimmed;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("Informe ao menos um campo para atualizar", 400);
  }

  req.body = data;

  return next();
}
