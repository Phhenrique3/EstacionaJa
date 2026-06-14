import { TipoCobranca } from "@prisma/client"
import { NextFunction, Response, Request } from "express"
import AppError from "../../../middlewares/AppError"

function isValidTipoCobranca(tipoCobranca:string ){
    return(
        tipoCobranca === "HORA" ||
        tipoCobranca === "DIARIA" ||
        tipoCobranca === "MENSAL"
    )
}

export function validatePricingRuleMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const {categoryId, tipo_cobranca, valor, tolerancia_minutos } = req.body

    if(!categoryId || !tipo_cobranca || valor === undefined ){
        throw new AppError(
            "Categoria tipo de cobrança e valor são obrigatórios ",
            400
        )
    }

    if(typeof categoryId !== "string"){
        throw new AppError(
            "Id da categoria deve ser um textpo",
            400
        )
    }

    if(typeof tipo_cobranca !== "string"){
        throw new AppError(
            "O tipo de cobrança deve ser um texto",
            400
        )
    }


    const tipoCobrancaNormaLized = tipo_cobranca.trim().toUpperCase()

    if(!isValidTipoCobranca(tipoCobrancaNormaLized)){
        throw new AppError(
            "Tipo de cobrança deve ser HORA, DIARIA, OU MENSAL",
            400 
        )
    }

    const valorNumber = Number(valor)

    if(Number.isNaN(valorNumber)){
        throw new AppError(
            "O valor deve ser número",
            400
        )
    }

    if(valorNumber <=0){
        throw new AppError(
            "O valor deve ser maior que Zero",
            400
        )
    }


    let toleranciaMinutosNumber = 0

    if(tolerancia_minutos !== undefined && tolerancia_minutos !== null){
        toleranciaMinutosNumber = Number(tolerancia_minutos)

        if(Number.isNaN(toleranciaMinutosNumber)){
            throw new AppError(
                "Tolerância em minutos deve ser um número", 400
            )
        }

        if(toleranciaMinutosNumber <0){
            throw new AppError(
                "A tolerencia em minutos não pode ser um valor negativo ",
                400
            )
        }


    }

    req.body = {
        categoryId: categoryId.trim(),
        tipo_cobranca: tipoCobrancaNormaLized,
        valor: valorNumber,
        tolerancia_minutos: toleranciaMinutosNumber
    }

    return next()

}