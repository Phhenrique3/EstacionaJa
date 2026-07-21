import { Router } from "express";
import { PasswordResetController } from "../controller/passwordResetController";
import { validateForgotPasswordMiddleware } from "../../PasswordResetToken/middleware/validateForgotPasswordMiddleware";
import { validateResetPasswordMiddleware } from "../../PasswordResetToken/middleware/validateResetPasswordMiddleware";

const authRoutes = Router();
const passwordResetController = new PasswordResetController();

authRoutes.post(
  "/forgot-password",
  validateForgotPasswordMiddleware,
  (req, res, next) => {
    return passwordResetController.forgotPassword(req, res, next);
  }
);

authRoutes.post(
  "/reset-password",
  validateResetPasswordMiddleware,
  (req, res, next) => {
    return passwordResetController.resetPassword(req, res, next);
  }
);

export { authRoutes };