import { Router } from "express";
import { usersRoutes } from "../modules/users/routes/usersRoutes";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({
    status: "ok",
    message: "Api funcionando",
  });
});

routes.use("/users", usersRoutes);

export { routes };