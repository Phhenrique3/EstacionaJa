import { NextFunction, Request, Response } from "express";
import { passwordResertService } from "../services/passwordResetService";

class PasswordResetController {
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await passwordResertService.forgotPassword(req.body);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await passwordResertService.resetPassword(req.body);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}
export { PasswordResetController }