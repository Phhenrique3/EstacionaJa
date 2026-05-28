import { NextFunction, Response, Request} from "express";
import {AppError} from "./AppError";


export class notFoundHandler { 
    static hendle(req: Request, res: Response, next: NextFunction){
        return next(new AppError(`Rota ${req.originalUrl}não encontrado`,404))
    }
}