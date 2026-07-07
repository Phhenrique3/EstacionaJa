import { NextFunction, Request, Response } from "express";
import { paymentService } from "../service/paymentService";
import AppError from "../../../middlewares/AppError";
import { getErrorMap } from "zod/v3";

class PaymentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.create(req.body);
      return res.status(201).json(payment);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.findAll();
      return res.status(201).json(payment);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        throw new AppError("Id pagamento é obrigatório");
      }
      const payment = await paymentService.findById(id);

      return res.status(201).json(payment);
    } catch (error) {
      return next(error);
    }
  }

  async findByParkingSessionId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const parkingSessionId = req.params.parkingSessionId;

      if (!parkingSessionId || typeof parkingSessionId !== "string") {
        throw new AppError("Id do estacionamento é obrigatório", 400);
      }
      const payment =
        await paymentService.findByParkingSessionId(parkingSessionId);
      return res.status(201).json(payment);
    } catch (error) {
      return next(error);
    }
  }
}

export { PaymentController };
