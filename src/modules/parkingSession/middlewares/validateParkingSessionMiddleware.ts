import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

function isValidTipoCobranca(tipoCobranca: string): boolean {
  return (
    tipoCobranca === "HORA" ||
    tipoCobranca === "DIARIA" ||
    tipoCobranca === "MENSAL"
  );
}

export function validateParkingSessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { vehicleId, parkingSpotId, tipo_cobranca } = req.body;

  if (!vehicleId || !parkingSpotId || !tipo_cobranca) {
    throw new AppError(
      "Veículo, vaga e tipo de cobrança são obrigatórios",
      400
    );
  }

  if (typeof vehicleId !== "string") {
    throw new AppError("ID do veículo deve ser um texto", 400);
  }

  if (typeof parkingSpotId !== "string") {
    throw new AppError("ID da vaga deve ser um texto", 400);
  }

  if (typeof tipo_cobranca !== "string") {
    throw new AppError("Tipo de cobrança deve ser um texto", 400);
  }

  const tipoCobrancaNormalized = tipo_cobranca.trim().toUpperCase();

  if (!isValidTipoCobranca(tipoCobrancaNormalized)) {
    throw new AppError("Tipo de cobrança deve ser HORA, DIARIA ou MENSAL", 400);
  }

  req.body = {
    vehicleId: vehicleId.trim(),
    parkingSpotId: parkingSpotId.trim(),
    tipo_cobranca: tipoCobrancaNormalized,
  };

  return next();
}