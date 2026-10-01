import { NextFunction, Request, Response, Router } from "express";
import { VehicleController } from "../controller/vehicleController";
import { validateUpdateVehicleMiddleware } from "../middlewares/ValidateupdateVehicleMiddleware";
const vehicleRoutes = Router();

export const vehicleController = new VehicleController();

vehicleRoutes.post("/", (req: Request, res: Response, next: NextFunction) => {
  return vehicleController.create(req, res, next);
});

vehicleRoutes.get("/", (req: Request, res: Response, next: NextFunction) => {
  return vehicleController.findAll(req, res, next);
});

vehicleRoutes.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleController.delete(req, res, next);
  },
);

vehicleRoutes.patch(
  "/:id",
  validateUpdateVehicleMiddleware,
  (req, res, next) => {
    return vehicleController.update(req, res, next);
  },
);

export { vehicleRoutes };
