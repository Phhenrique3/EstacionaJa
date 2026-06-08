import { NextFunction, Request,Response, Router } from "express";
import { VehicleController } from "../controller/vehicleController";
const vehicleRoutes = Router();

export const vehicleController = new VehicleController();

vehicleRoutes.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleController.create(req, res, next);
  }
);

vehicleRoutes.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleController.findAll(req, res, next);
  }
);

vehicleRoutes.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleController.delete(req, res, next);
  }
);

export { vehicleRoutes };