import { Router } from "express";
import { ReportsController } from "../../vehicle/controller/reportsVehicleController";

const resportsVehicle = Router();
const resportController = new ReportsController();

resportsVehicle.get("/VhiclePdf", (req, res, next) => {
  return resportController.listVehicle(req, res, next);
});

resportsVehicle.get("/pdf", (req, res, next) => {
  return resportController.exportVhicle(req, res, next);
});

export { resportsVehicle };
