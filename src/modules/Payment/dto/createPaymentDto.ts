import { PaymentMethod } from "@prisma/client";

export interface CreatePaymentDTO{
    parkingSessionId: string,
    metodo_pagamento: PaymentMethod
}