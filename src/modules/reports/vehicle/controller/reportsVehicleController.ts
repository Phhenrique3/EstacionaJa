import { NextFunction, Request, Response } from "express";
import { reportsService } from "../../vehicle/service/reportsVehicleService";

class ReportsController {
  async listVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const Vehicle = await reportsService.listVehicle();
      return res.status(200).json(Vehicle);
    } catch (error) {
      return next(error);
    }
  }

  async exportVhicle(req: Request, res: Response, next: NextFunction) {
    try {
      const pdfBuffer = await reportsService.vehiclePDF();
      res.setHeader("Content-type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="relatorio-Veículo.pdf"',
      );
      return res.status(200).send(pdfBuffer);
    } catch (error) {
      return next(error);
    }
  }
}

export { ReportsController };
