import { NextFunction, Request, Response} from "express";
import { vehicleService } from "../services/vehicleService";
import AppError from "../../../middlewares/AppError";


class VehicleController {
    async create(req:Request, res:Response, next:NextFunction){
        try{
            const vehicle = await vehicleService.create(req.body)
            return res.status(200).json(vehicle)
        }catch(error){
            return next(error)
        }
    }   
        async findAll(req: Request, res:Response, next:NextFunction){
            try{
                const vehicle = await vehicleService.findAll()
                return res.status(200).json(vehicle)
            }catch(error){
                return next(error)
            }
        }

        async findById(res: Response, req:Request, next:NextFunction){
            try{
                const { id } = req.params
                if (!id || typeof id !== "string") {
                    throw new AppError("ID do veículo é obrigatório", 400)
                }
                const vehicle = await vehicleService.findById(id)
                return res.status(200).json(vehicle)
            }catch(error){
                return next(error)
            }
        }

        async delete(req: Request, res: Response, next:NextFunction){
            try{
                const { id } = req.params
                  if (!id || typeof id !== "string") {
                    throw new AppError("Id dp veículo é obrigatório")
                }
                const vehicle = await vehicleService.delete(id)
                return res.status(201).json(vehicle)
            }catch(error){
                return next(error)
            }
        }

}

export {VehicleController}