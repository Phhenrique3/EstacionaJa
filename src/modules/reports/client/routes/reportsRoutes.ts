import { Router } from "express";
import { ReportsController } from "../controller/reportsController";

const reportsRoutes = Router();
const reportsController = new ReportsController();

reportsRoutes.get("/clients", (req, res, next) => {
  return reportsController.listClients(req, res, next);
});

reportsRoutes.get("/clients/pdf", (req, res, next) => {
  return reportsController.exportClientsPdf(req, res, next);
});

export { reportsRoutes };
