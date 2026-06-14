import { NextFunction, Request, Response } from "express";
import { pricingRuleService } from "../services/pricingRuleService";
import AppError from "../../../middlewares/AppError";

class PricingRuleController {
    async create(req: Request, res: Response, next:NextFunction){
        try{
            const pricingRule = await pricingRuleService.create(req.body)
            return res.status(200).json(pricingRule)
        }catch(error){
            return next(error)
        }
    }

    async findAll(req:Request, res: Response, next:NextFunction){
        try{
            const pricingRule = await pricingRuleService.findAll()
            return res.status(200).json(pricingRule)
        }catch(error){
            return next(error)
        }
    }

    async findById(req:Request, res:Response, next:NextFunction){
        try{
            const id =req.params.id;

            if(!id || typeof id !== "string"){
                throw new AppError(
                    "Id da regra de cobrança é brigatório ",
                    404
                )
            }

            const pricingRule = await pricingRuleService.findById(id)

            return res.status(200).json(pricingRule)
                }catch(error){
            return next(error)
        }
    }

    async findCategoryId(req: Request, res:Response, next:NextFunction){
        try{
            const  id  = req.params.id

            if(!id || typeof id !== "string"){
                throw new AppError(
                    "Id da categoria é obrigatorio",
                404
                )
            }
            const pricingRule = await pricingRuleService.findByCategoryId(id)

            return res.status(201).json(pricingRule)
            
        }catch(error){
            return next(error)
        }
    }
    async update(req: Request, res:Response,next:NextFunction){
        try{
        const id = req.params.id
        if (!id || typeof id !== "string") {
        throw new AppError(
            "ID da regra de cobrança é obrigatório",        
            400
    );
      }

      const pricingRule = await pricingRuleService.update(id, req.body);

      return res.status(200).json(pricingRule);
        }catch(error){
            return next(error)
        }
    }

    async delete(req:Request, res: Response, next:NextFunction){
        try{
            const id = req.params.id
            
            if(!id || typeof id !== "string"){
                throw new AppError(
                    "Id é obrigatório",
                    400
                )
            }
        const results = await pricingRuleService.delete(id);
        return res.status(200).json(results)
        }catch(error){
            return next(error)
        }
    }
}

export {  PricingRuleController }