import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

function isValidPaymentMethod(paymentMethod: string): boolean {
  return (
    paymentMethod === "DINHEIRO" ||
    paymentMethod === "PIX" ||
    paymentMethod === "CARTAO_DEBITO" ||
    paymentMethod === "CARTAO_CREDITO"
  );
}

export function validatePaymentMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body ?? {};

  const { parkingSessionId, metodo_pagamento } = body;

  if (!parkingSessionId || !metodo_pagamento) {
    throw new AppError(
      "Estacionamento e método de pagamento são obrigatórios",
      400
    );
  }

  if (typeof parkingSessionId !== "string") {
    throw new AppError("ID do estacionamento deve ser um texto", 400);
  }

  if (typeof metodo_pagamento !== "string") {
    throw new AppError("Método de pagamento deve ser um texto", 400);
  }

  const parkingSessionIdNormalized = parkingSessionId.trim();
  const paymentMethodNormalized = metodo_pagamento.trim().toUpperCase();

  if (!parkingSessionIdNormalized) {
    throw new AppError("ID do estacionamento é obrigatório", 400);
  }

  if (!isValidPaymentMethod(paymentMethodNormalized)) {
    throw new AppError(
      "Método de pagamento deve ser DINHEIRO, PIX, CARTAO_DEBITO ou CARTAO_CREDITO",
      400
    );
  }

  req.body = {
    parkingSessionId: parkingSessionIdNormalized,
    metodo_pagamento: paymentMethodNormalized,
  };

  return next();
}