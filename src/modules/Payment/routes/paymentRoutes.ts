import { NextFunction, Router } from "express";
import { PaymentController } from "../controller/paymentController";
import { validatePaymentMiddleware } from "../middlewares/validatePaymentMiddleware";

const paymentRoutes = Router();

const paymentController = new PaymentController();

paymentRoutes.post("/", validatePaymentMiddleware, (req, res, next) => {
  return paymentController.create(req, res, next);
});

paymentRoutes.get("/",
(req,res,next)=>{
  return paymentController.findAll(req,res,next)
}
),

paymentRoutes.get("/parking-session/:parkingSessionId",
  (req, res, next:NextFunction)=>{
    return paymentController.findByParkingSessionId(req, res,next)
  }
)


paymentRoutes.get("/:id",
(req,res,next)=>{
  return paymentController.findAll(req,res,next)
},)


export {paymentRoutes}