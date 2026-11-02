import { Router } from "express";
import { ReportsController } from "../../parking/controller/reportsParkingSessionController";

const reportsParkingSessionRoutes = Router();
const reportsController = new ReportsController();

reportsParkingSessionRoutes.get("/ParkingSessions/clients", (req, res, next) => {
  return reportsController.listParkingSessions(req, res, next);
});

reportsParkingSessionRoutes.get("/pdf", (req, res, next) => {
  return reportsController.exportParkingSessionsPdf(req, res, next);
});

export { reportsParkingSessionRoutes };
