import { NextFunction, Request, Response } from "express";
import { vehicleCategoryService } from "../services/vehicleCategoryService";
import AppError from "../../../middlewares/AppError";


class VehicleCategoryController{
    async create(req: Request, res:Response, next:NextFunction){
        try{
            const category = await vehicleCategoryService.create(req.body)

            return res.status(200).json(category)
        }catch(error){
            return next(error)

        }
    }


    async findAll(req: Request, res: Response, next:NextFunction){
        try{
            const contegories = await vehicleCategoryService.findAll()

            return res.status(201).json(contegories)
        }catch(error){
            return next(error)
        }
    }

    async findById(req: Request, res:Response, next:NextFunction){
        try{
            const { id } = req.body

            if(!id){
                throw new AppError("Id de categoria não encontrado",400)
            }

            const category = await vehicleCategoryService.update(id, req.body)

            return res.status(201).json(category)
        }catch(error){
            return next(error)
        }

    }

    async delete(req: Request, res:Response, next:NextFunction){
        try{

            const {id} = req.body

            if(!id){
                throw new AppError("Id da categoria é obrigatorio",400)
            }

            const result = await vehicleCategoryService.delete(id)
            
            return res.status(201).json(result)
        }catch(error){
            return next(error)
        }
    }
}

export {VehicleCategoryController}