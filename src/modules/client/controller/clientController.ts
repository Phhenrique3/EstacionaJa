import { NextFunction, Request, Response } from "express"; 
import { clientService } from "../service/clientService";
import AppClient from "../../../middlewares/AppError";



class ClientController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const client = await clientService.create(req.body);

      return res.status(201).json(client);
    } catch (error) {
      return next(error);
    }
  }


async findAll(req: Request, res: Response, next: NextFunction) {
      try{
       const clients = await clientService.findAll()
        return res.status(200).json(clients)
    }catch(error){
      return next(error)
    }
  }


  async delete(req:Request, res: Response, next:NextFunction){
    try{

      const  id  = req.params.id

    
    if (!id || typeof id !== "string") {
      throw new AppClient("ID do cliente é obrigatório", 400);
    }

      const results = await clientService.delete(id);
      return res.status(200).json(results)
    }catch(error){
      return next(error) 
    }
  }
}

export { ClientController };