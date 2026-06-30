import { NextFunction,Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

export function validateParkingSessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const {vehicleId, parkingSpotId} = req.body

    if(!vehicleId || !parkingSpotId){
        throw new AppError(
            "Véiculo e vaga são obrigatório"
            ,400
        )
    }

    if(typeof parkingSpotId !== "string"){
        throw new AppError(
            "Id do veículo e obrigatorio",
            400
        )
    }

    if(typeof vehicleId !== "string"){
        throw new AppError(
            "Id da vaga deve ser um texto",
            400
        )
    }

    req.body = {
        vehicleId : vehicleId.trim(),
        parkingSpotId : parkingSpotId.trim()
    }

    return next()
}