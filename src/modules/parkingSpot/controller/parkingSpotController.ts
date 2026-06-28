import { NextFunction, Request,Response} from "express";
import { parkingSpotService } from "../services/parkingSpotService";
import AppError from "../../../middlewares/AppError";
import { tr } from "zod/locales";
import { pricingRuleService } from "../../pricingRule/services/pricingRuleService";

class ParkingSpotController {
    async create(req: Request, res:Response, next:NextFunction){
        try{
            const parkingSpot = await parkingSpotService.create(req.body)
            return res.status(201).json(parkingSpot)
        }catch(error){
            return next(error)
        }
    }

    async findAll(req:Request, res: Response, next: NextFunction){
        try{
            const parking = await parkingSpotService.findAll()
        return res.status(201).json(parking)
        }catch(error){
            return next(error)
        }
    }

    async findBy(req: Request, res:Response, next:NextFunction){
        try{
            const id = req.params.id
            if(!id || typeof id !== "string"){
                throw new AppError(
                "Id da do patio e obrigatório"
                ,404)
            }
            const parkingSpot = await parkingSpotService.findById(id)
            return res.status(201).json(parkingSpot)
        }catch(error){
            return next(error)
        }
    }

    async update(req: Request, res: Response, next:NextFunction){
        try{
            const id = req.params.id
            if(!id || typeof id !== "string"){
                throw new AppError(
                "Id da Patio é obrigatório",
                400
            )
        }
        const parkingSpot = await parkingSpotService.update(id,req.body)
         return res.status(201).json(parkingSpot)
        }catch(error){
        return next(error)
        }
    }

    async delete(req: Request, res:Response, next:NextFunction){
        try{
            const id = req.params.id
            if(!id || typeof id !== "string"){
                throw new AppError(
                    "Id é obrigatório",400
                )
            }
            const result = await parkingSpotService.delete(id)
            return res.status(201).json(result)
        }catch(error){
            return next(error)
        }
    }
} 


export { ParkingSpotController };