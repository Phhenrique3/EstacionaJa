import { NextFunction, Request, Response, Router } from "express";
import { validateVehicleCategoryMiddleware } from "../middlewares/validateVehicleCategoryMiddleware";
import { VehicleCategoryController } from "../controller/vehicleCategoryController";
import { validateUpdateVehicleCategoryMiddleware } from "../middlewares/validateUpdateVehicleCategoryMiddleware";

const vehicleCategoryRoutes = Router();

const vehicleCategoryController = new VehicleCategoryController();

vehicleCategoryRoutes.post(
  "/",
  validateVehicleCategoryMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleCategoryController.create(req, res, next);
  },
);

vehicleCategoryRoutes.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleCategoryController.findAll(req, res, next);
  },
);

vehicleCategoryRoutes.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleCategoryController.findAll(req, res, next);
  },
);

vehicleCategoryRoutes.patch(
  "/:id",
  validateUpdateVehicleCategoryMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleCategoryController.update(req, res, next);
  },
);

vehicleCategoryRoutes.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    return vehicleCategoryController.delete(req, res, next);
  },
);

export { vehicleCategoryRoutes };
