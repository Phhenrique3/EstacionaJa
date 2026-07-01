import { create } from "node:domain";
import { CreatePaymentDTO } from "../dto/createPaymentDto";
import { ParkingSessionModel } from "../../parkingSession/models/parkingSessionModel";
import AppError from "../../../middlewares/AppError";
import { PaymentModel } from "../model/paymentModel";

export const paymentService = {
    async create(dto:CreatePaymentDTO){
        const parkingSession = await ParkingSessionModel.findById(
            dto.parkingSessionId
        )
        if(!parkingSession){
            throw new AppError("Estacionamento não encontrado",404)
        }
        if(parkingSession.status !== "FECHADO"){
            throw new AppError("O pagamento só pode ser realizado para estacionamento fechado"
            ,404)
        }
        if(parkingSession.valor_total === null){
            throw new AppError(
                "Estacionamento não possui  valor total calculado",
                400
            )
        }
        if(parkingSession.valor_total === null){
            throw new AppError(
                "Estacinamento não possui valor total calculado",
                400
            )
        }
        const paymentAlereadyExists = 
        await PaymentModel.findByParkingSessionId(dto.parkingSessionId)

        if(paymentAlereadyExists){
            throw new AppError(
                "Esse estacionamento já possui pagamento registrado",
                409
            )
        }
        const payment = await PaymentModel.create({
            parkingSessionId: dto.parkingSessionId,
            metodo_pagamento: dto.metodo_pagamento,
            valor_pago: Number(parkingSession.valor_total)
        })

        return payment
    },

    async findAll(){
        const payment = await PaymentModel.findAll()

        if(!payment){
            throw new AppError("Pagamento não encontrado",400)
        }
        return payment
    },
    async findById(id: string){
        const payment = await PaymentModel.findById(id)

        if(!payment){
            throw new AppError("Pagamento não encontrado",404)
        }
        return payment
    },

    async findByParKingSessionId(parkingSessionId: string){
        const payment = await PaymentModel.findByParkingSessionId(parkingSessionId)

        if(!payment){
            throw new AppError(
                "Pagamento não  encontrado para esse estacionamento"
                ,404)
        }
        return payment
    }
    
}