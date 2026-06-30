import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

function isValidTipoCobranca(TipoCobranca: string): boolean {
    return(
        TipoCobranca === "HORA" || 
        TipoCobranca === "DIARIA"||
        TipoCobranca === "MENSAL"
    )
}

export function validateCloseParkingSessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const { tipo_cobranca } = req.body

    if(tipo_cobranca === undefined || tipo_cobranca === null || tipo_cobranca === ""){
        req.body = {
            tipo_cobranca: "HORA"
        }

        return next ()
    }

    if(typeof tipo_cobranca !== "string"){
        throw new AppError("Tipo de cobrança deve ser um texto",400)
    }

    const tipoCobrançaNormaLizd = tipo_cobranca.trim().toUpperCase()

    if(!isValidTipoCobranca(tipoCobrançaNormaLizd)){
        throw new AppError("Tipo de cobrança deve ser HORA, DIARIA OU MENSAL",400)
    }

    req.body={
        tipo_cobranca: tipoCobrançaNormaLizd
    }
    
    return next()
}