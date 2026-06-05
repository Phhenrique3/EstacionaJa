import { Router } from "express";
import { usersRoutes } from "../modules/users/routes/usersRoutes";
import { clientRoutes } from "../modules/client/routes/clientRoutes";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({
    status: "ok",
    message: "Api funcionando",
  });
});

routes.use("/users", usersRoutes);
routes.use("/clients", clientRoutes );
export { routes };