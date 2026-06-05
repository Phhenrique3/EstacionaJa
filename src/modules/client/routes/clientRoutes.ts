import { ClientController } from "../controller/clientController";
import { validateRegisterClientMiddleware } from "../middlewares/validateClientMiddleware";
import { NextFunction, Request, Response, Router } from "express"; 



const clientRoutes =    Router();

const clientController = new ClientController();

clientRoutes.post("/",validateRegisterClientMiddleware,(req: Request, res:Response, next:NextFunction) => {
  return clientController.create(req, res, next);
})

clientRoutes.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    return clientController.findAll(req, res, next);
  });

clientRoutes.delete(
  "/:id",
  (req: Request, res:Response, next:NextFunction) => {
    return clientController.delete(req,res,next)
  }
)


export { clientRoutes };