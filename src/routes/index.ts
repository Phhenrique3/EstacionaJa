import { Router } from "express";
import { usersRoutes } from "../modules/users/routes/usersRoutes";
import { clientRoutes } from "../modules/client/routes/clientRoutes";
import { vehicleCategoryRoutes } from "../modules/vehicleCategory/routes/vehicleCategoryRoutes";
import { vehicleRoutes } from "../modules/vehicle/routes/vehicleRoutes";
import { pricingRuleRoutes } from "../modules/pricingRule/routes/pricingRuleRoutes";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({
    status: "ok",
    message: "Api funcionando",
  });
});

routes.use("/users", usersRoutes);
routes.use("/clients", clientRoutes );
routes.use("/vehicle-categories", vehicleCategoryRoutes);
routes.use("/vehicles", vehicleRoutes );
routes.use("/pricing-rules",pricingRuleRoutes)

export { routes };  