import { Router } from "express";
import { UsersController } from "../controllers/usersController";
import { validateRegisterMiddleware } from "../middlewares/validateRegisterMiddleware";
import { validateLoginMiddleware } from "../middlewares/validateLoginMiddleware";

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/", validateRegisterMiddleware,(req, res, next) => {
  return usersController.create(req, res, next);
});

usersRoutes.post("/login", validateLoginMiddleware,(req, res, next) => {
  return usersController.login(req, res, next);
});

export { usersRoutes };