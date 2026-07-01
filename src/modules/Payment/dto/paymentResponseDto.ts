import { PaymentMethod } from "@prisma/client";

export interface PaymentResponseDTO{
    id: string,
    parkingSessionId: string,
    metado_pagamento: PaymentMethod,
    valor_pago: number,
    pago_em :Date,
    createdAt: Date;
    updatedAt: Date;
}