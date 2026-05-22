import { Router } from "express";
import { UsersController } from "../controllers/usersController";

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/",  (request, response, next) => {
  return usersController.create(request, response, next);
});

export { usersRoutes };