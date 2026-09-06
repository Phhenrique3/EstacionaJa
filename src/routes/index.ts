import { Router } from "express";
import { usersRoutes } from "../modules/users/routes/usersRoutes";
import { clientRoutes } from "../modules/client/routes/clientRoutes";
import { vehicleCategoryRoutes } from "../modules/vehicleCategory/routes/vehicleCategoryRoutes";
import { vehicleRoutes } from "../modules/vehicle/routes/vehicleRoutes";
import { pricingRuleRoutes } from "../modules/pricingRule/routes/pricingRuleRoutes";
import { parkingSpotRoutes } from "../modules/parkingSpot/routes/parkingSpotRoutes";
import { parkingSessionRouter } from "../modules/parkingSession/routes/parkingSessionRoutes";
import { paymentRoutes } from "../modules/Payment/routes/paymentRoutes";
import { authRoutes } from "../modules/PasswordResetToken/routes/PasswordResetTokenRoute";
import { reportsRoutes } from "../modules/reports/routes/reportsRoutes";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({
    status: "ok",
    message: "Api funcionando",
  });
});
routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/clients", clientRoutes);
routes.use("/vehicle-categories", vehicleCategoryRoutes);
routes.use("/vehicles", vehicleRoutes);
routes.use("/pricing-rules", pricingRuleRoutes);
routes.use("/parking-spots", parkingSpotRoutes);
routes.use("/parking-sessions", parkingSessionRouter);
routes.use("/payments", paymentRoutes);
routes.use("/reports", reportsRoutes);
export { routes };
