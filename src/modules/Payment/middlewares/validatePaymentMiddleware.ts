import { PaymentMethod } from "@prisma/client";
import { NextFunction, Request, Response  } from "express";
import AppError from "../../../middlewares/AppError";

function isValidPaymentMethod(PaymentMethod: string): boolean{
    return(
        PaymentMethod === "DINHEIRO" ||
        PaymentMethod === "PIX" ||
        PaymentMethod === "CARTAO_DEBITO" ||
        PaymentMethod === "CARTAO_CREDITO"
    )
}
export function validatePaymentMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const {parKingSessionId, metodo_pagamento} = req.body

    if(!parKingSessionId || !metodo_pagamento){
        throw new AppError(
            "Estacionamento e método de pagamento são obrigatório",
            400)
    }
    if(typeof parKingSessionId !== "string"){
        throw new AppError(
            "Id do estacionamento deve ser um texo"
            ,400)
    }
    if(typeof metodo_pagamento !== "string"){
        throw new AppError(
        "Métado de pagamento deve ser um texto",
        400)
    }

    const PaymentMethodNormalized = metodo_pagamento.trim().toUpperCase()

    if(!isValidPaymentMethod(PaymentMethodNormalized)){
        throw new AppError(
            "Método de pagamento deve ser DINHEIRO, PIX, CARTAO_DEBITO ou CARTAO_CREDITO",
            400
        )
    }
    req.body ={ 
        parKingSessionId: parKingSessionId.trim(),
        metodo_pagamento: PaymentMethodNormalized
    }
    return next()
}