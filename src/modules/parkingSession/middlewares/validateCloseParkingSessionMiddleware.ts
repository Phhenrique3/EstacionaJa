import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

function isValidTipoCobranca(tipoCobranca: string): boolean {
  return (
    tipoCobranca === "HORA" ||
    tipoCobranca === "DIARIA" ||
    tipoCobranca === "MENSAL"
  );
}

export function validateCloseParkingSessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body ?? {};

  const tipo_cobranca = body.tipo_cobranca;

  if (
    tipo_cobranca === undefined ||
    tipo_cobranca === null ||
    tipo_cobranca === ""
  ) {
    req.body = {
      tipo_cobranca: "HORA",
    };

    return next();
  }

  if (typeof tipo_cobranca !== "string") {
    throw new AppError("Tipo de cobrança deve ser um texto", 400);
  }

  const tipoCobrancaNormalized = tipo_cobranca.trim().toUpperCase();

  if (!isValidTipoCobranca(tipoCobrancaNormalized)) {
    throw new AppError("Tipo de cobrança deve ser HORA, DIARIA ou MENSAL", 400);
  }

  req.body = {
    tipo_cobranca: tipoCobrancaNormalized,
  };

  return next();
}