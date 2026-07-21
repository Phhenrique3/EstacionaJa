import { NextFunction, Request, Response } from "express";
import AppError from "../../../middlewares/AppError";

export function validateForgotPasswordMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const {email} = req.body

    if(!email){
        throw new AppError("Email é obrigatório",400)
    }

    if(typeof email !== "string"){
        throw new AppError("E-mail deve ser um texto")
    }

    req.body = {
        email: email.trim().toLowerCase(),
    }

    return next()
}