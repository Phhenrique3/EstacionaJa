import { NextFunction, Request, Response, Router } from "express";
import { ParkingSpotController } from "../controller/parkingSpotController";
import { validateParkingSpotMiddleware } from "../middlewares/validateParkingSpotMiddleware";


const parkingSpotRoutes = Router();


const parkingSpotController = new ParkingSpotController

parkingSpotRoutes.post("/",

    validateParkingSpotMiddleware, 
    (req: Request, res:Response, next: NextFunction) => {
        return parkingSpotController.create(req,res,next)
    }
) 

parkingSpotRoutes.get("/",
(req: Request, res: Response, next:NextFunction)=>{
    return parkingSpotController.findAll(req,res, next)
}
)

parkingSpotRoutes.get("/:id",
(req: Request, res:Response, next:NextFunction) =>{
    return parkingSpotController.findBy(req, res, next)
    }
)

parkingSpotRoutes.put("/:id",
    validateParkingSpotMiddleware,
    (req:Request, res:Response, next:NextFunction)=>{
        return parkingSpotController.update(req,res,next)
    } 
)

parkingSpotRoutes.delete("/:id",
    (req:Request, res:Response, next:NextFunction)=>{
        return parkingSpotController.delete(req,res,next)
    }
)


export { parkingSpotRoutes };
