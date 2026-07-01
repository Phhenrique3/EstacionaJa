import { NextFunction, Request, Response } from "express";
import { parkingSessionService } from "../services/parkingSessionService";
import { nextTick } from "node:process";
import AppError from "../../../middlewares/AppError";
import { json } from "zod";

class ParkingSessionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parkingSession = await parkingSessionService.create(req.body);
      return res.status(201).json(parkingSession);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const parkingSession = await parkingSessionService.findAll();
      return res.status(201).json(parkingSession);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string") {
        throw new AppError("ID do estacionamento é obrigatório", 400);
      }
      const parkingSession = await parkingSessionService.findById(id);
      return res.status(201).json(parkingSession);
    } catch (error) {
      return next(error);
    }
  }

  async close(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string") {
        throw new AppError("ID do estacionamento e obrigatório", 400);
      }

      const parkingSession = await parkingSessionService.close(id, req.body);

      return res.status(201).json(parkingSession);
    } catch (error) {
      return next(error);
    }
  }
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        throw new AppError("ID do estacionamento e obrigatório", 400);
      }
      const parkingSession = await parkingSessionService.cancel(id);
      return res.status(201).json(parkingSession);
    } catch (error) {
      return next(error);
    }
  }
}
export { ParkingSessionController };