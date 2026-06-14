import { NextFunction, Router, Request, Response } from "express";
import { validatePricingRuleMiddleware } from "../middlewares/validatePricingRuleMiddleware";
import { PricingRuleController } from "../controller/pricingRuleController";

const pricingRuleRoutes = Router()

const pricingRuleController = new PricingRuleController()

pricingRuleRoutes.post(
  "/",
  validatePricingRuleMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return pricingRuleController.create(req, res, next);
  }
);
pricingRuleRoutes.get("/", (req: Request, res: Response, next: NextFunction) => {
  return pricingRuleController.findAll(req, res, next);
});

pricingRuleRoutes.get(
  "/category/:categoryId",
  (req: Request, res: Response, next: NextFunction) => {
    return pricingRuleController.findCategoryId(req, res, next);
  }
);

pricingRuleRoutes.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  return pricingRuleController.findById(req, res, next);
});

pricingRuleRoutes.put(
  "/:id",
  validatePricingRuleMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return pricingRuleController.update(req, res, next);
  }
);

pricingRuleRoutes.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    return pricingRuleController.delete(req, res, next);
  }
);

export { pricingRuleRoutes };