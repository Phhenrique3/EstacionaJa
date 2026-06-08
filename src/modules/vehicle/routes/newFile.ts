import { Request, Response, NextFunction } from "express";
import { vehicleRoutes, vehicleController } from "./vehicleRoutes";

vehicleRoutes.get(
    "/:id",
    (req: Request, res: Response, next: NextFunction) => {
        return vehicleController.findById(req, res, next);
    }
);
