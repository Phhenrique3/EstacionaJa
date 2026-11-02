import { NextFunction, Request, Response } from "express";
import { reportsService } from "../../parking/service/reportsServiceParking";

class ReportsController {
  async listParkingSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const ParkingSessions = await reportsService.listParkingSessions();

      return res.status(200).json(ParkingSessions);
    } catch (error) {
      return next(error);
    }
  }

  async exportParkingSessionsPdf(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const pdfBuffer = await reportsService.generateParkingSessionsPdf();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="relatorio-estacionado.pdf"',
      );

      return res.status(200).send(pdfBuffer);
    } catch (error) {
      return next(error);
    }
  }
}

export { ReportsController };
