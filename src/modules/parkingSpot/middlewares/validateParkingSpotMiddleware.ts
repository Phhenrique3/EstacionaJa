import { NextFunction, Response, Request} from "express";
import AppError from "../../../middlewares/AppError";

export function validateParkingSpotMiddleware (
    req: Request,
    res: Response,
    next: NextFunction
){
    const {numero, patio} = req.body;


    if(!numero){
        throw new AppError("Número da vaga é obrigatório",400)
    }

    if(typeof numero !== "string"){
        throw new AppError("Número da vaga deve ser um texto",400)
    }

    const numeroNormalized = numero.trim().toUpperCase()
    if(numeroNormalized.length <3){
        throw new AppError("O Número da vaga não pode ser vazio",400)
    }

    let patioNormalized : string | undefined;

    if(patio !== undefined && patio !== null && patio !== "string"){
        if(typeof patio !== "string"){
            throw new AppError("Patio deve ser texto", 400)
        }

        patioNormalized = patio.trim()

    }

    req.body = {

        numero: numeroNormalized,
        patio : patioNormalized
    }

    return next()
}