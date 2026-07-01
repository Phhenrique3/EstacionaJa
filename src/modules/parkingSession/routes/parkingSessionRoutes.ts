import { NextFunction, Router, Request, Response } from "express";
import { ParkingSessionController } from "../controller/parkingSessionController";
import { validateParkingSessionMiddleware } from "../middlewares/validateParkingSessionMiddleware";
import { validateCloseParkingSessionMiddleware } from "../middlewares/validateCloseParkingSessionMiddleware";

const parkingSessionRouter = Router();

const parkingSessionsControler = new ParkingSessionController();

parkingSessionRouter.post(
  "/",
  validateParkingSessionMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return parkingSessionsControler.create(req, res, next);
  },

  parkingSessionRouter.get(
    "/",
    (req: Request, res: Response, next: NextFunction) => {
    return parkingSessionsControler.findAll(req, res, next);
  }),

parkingSessionRouter.get(
    "/:id",
    (req:Request, res:Response, next:NextFunction)=>{
    return parkingSessionsControler.findById(req,res,next)
    }
  ),

  parkingSessionRouter.patch(
    "/:id/close",
    validateCloseParkingSessionMiddleware,
    (req:Request, res:Response, next:NextFunction)=>{
        return parkingSessionsControler.close(req,res,next)
    }
  ),

  parkingSessionRouter.patch(
    "/:id/cancel",
    (req: Request, res:Response, next:NextFunction)=>{
        return parkingSessionsControler.cancel(req, res,next)
    }
  )
);

export { parkingSessionRouter }