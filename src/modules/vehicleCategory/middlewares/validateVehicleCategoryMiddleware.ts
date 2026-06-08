import { NextFunction, Request, Response} from "express";
import AppError from "../../../middlewares/AppError";



export function validateVehicleCategoryMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
){
    const {name, descriptiom} = req.body;
    if(!name){
        throw new AppError("Nome da categoria é obrigatório", 400)
    }

    if(typeof name !== "string"){
        throw new AppError("Nome da categoria deve ser um texto ",400)
    }

    const nameTtrimmed = name.trim()

    if(nameTtrimmed.length <2){
        throw new AppError("Nome da categoria precisa ter no mínimo 2 carateres",400)
    }
    
    if(descriptiom !== undefined && descriptiom !== null){
        if(typeof descriptiom !== "string"){
            throw new AppError("Descrição deve ser um texo",400)
        }
    }

    return next()
}