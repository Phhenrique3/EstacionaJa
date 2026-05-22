import { NextFunction, Request, Response } from "express";
import { usersService } from "../services/usersService";
import badRequestError from "../../../middlewares/badRequestError";

class UsersController {
  async create(req: Request, res: Response, next: NextFunction) {
    
      const { name, email, password } = req.body 

      if(!name || !email || !password){
        throw new badRequestError(
          "name, email e password são obrigatorios"
        )
      }

      try{
        const user = await usersService.register({name, email, password})
        return res.status(201).json(user)
    } catch (error) {
      return next(error);
    }
  }
}

export { UsersController };