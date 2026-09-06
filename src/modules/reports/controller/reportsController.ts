import { NextFunction, Request, Response } from "express";
import { reportsService } from "../services/reportsService";

class ReportsController {
  async listClients(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await reportsService.listClients();

      return res.status(200).json(clients);
    } catch (error) {
      return next(error);
    }
  }

  async exportClientsPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const pdfBuffer = await reportsService.generateClientsPdf();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="relatorio-clientes.pdf"',
      );

      return res.status(200).send(pdfBuffer);
    } catch (error) {
      return next(error);
    }
  }
}

export { ReportsController };
