import { TipoCobranca } from "@prisma/client";
import AppError from "../../../middlewares/AppError";
import { CreateParkingSessionDTO } from "../dtos/createParkingSessionDto";
import { vehicleModel } from "../../vehicle/models/vehicleModel";
import { ParkingSpotModel } from "../../parkingSpot/models/parkingSpotModel";
import { ParkinSessionModel } from "../models/parkingSessionModel";
import { CloseParkingSessionDTO } from "../dtos/closeParkingSessionDto";
import { PricingRuleModel } from "../../pricingRule/models/pricingRuleModel";

function calculateMinutesBetween(startDate: Date, endDate: Date): number {
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();

  return Math.ceil(diffInMilliseconds / 100 / 60);
}

function calculateAmount(
  totalMinutes: number,
  value: number,
  toleranceMinutes: number,
  tipoCobranca: TipoCobranca,
): number {
  if (totalMinutes <= toleranceMinutes) {
    return 0;
  }

  if (tipoCobranca === "HORA") {
    const totalHours = Math.ceil(totalMinutes / 60);
    return totalHours * value;
  }
  if (tipoCobranca === "DIARIA") {
    const minutesPerDay = 24 * 60;
    const totalDays = Math.ceil(totalMinutes / minutesPerDay);
    return totalDays * value;
  }

  if (tipoCobranca === "MENSAL") {
    const minutesPerMonth = 30 * 24 * 60;
    const totalMonths = Math.ceil(totalMinutes / minutesPerMonth);
    return totalMonths * value;
  }

  throw new AppError("Tipo de cobraça invalida", 400);
}

export const parkingSessionService = {
  async create(dto: CreateParkingSessionDTO) {
    const vehicle = await vehicleModel.findById(dto.vehicleId);

    if (!vehicle) {
      throw new AppError("Veículo não encontrado", 404);
    }

    const parkingSpot = await ParkingSpotModel.findById(dto.parkingSpotId);

    if (!parkingSpot) {
      throw new AppError("Vaga não encontrada", 404);
    }
    if (parkingSpot.status !== "DISPONIVEL") {
      throw new AppError("Vaga não está disponivel", 404);
    }
    const openSessionByVehicle = await ParkinSessionModel.findOpenByVehicleId(
      dto.vehicleId,
    );

    if (openSessionByVehicle) {
      throw new AppError(
        "Esse veículo já possui um estacionamento aberto",
        409,
      );
    }
    const parkingSession = await ParkinSessionModel.create({
      vehicleId: dto.vehicleId,
      parkingSpotId: dto.parkingSpotId,
    });
    await ParkingSpotModel.update(dto.parkingSpotId, {
      status: "OCUPADA",
    });
    return parkingSession;
  },

  async fiandAll() {
    const parkingSessions = await ParkinSessionModel.findAll();
    return parkingSessions;
  },

  async findById(id: string) {
    const parkingSession = await ParkinSessionModel.findById(id);

    if (!parkingSession) {
      throw new AppError("Estacionamento não encontrado ", 404);
    }
    return parkingSession;
  },

  async close(id: string, dto: CloseParkingSessionDTO) {
    const parkingSession = await ParkinSessionModel.findById(id);
    if (!parkingSession) {
      throw new AppError("Estacionamento não encontrado", 404);
    }
    if (parkingSession.status !== "ABERTO") {
      throw new AppError("Estacionamento não está aberto", 400);
    }

    const tipoCobranca = dto.tipo_cobranca ?? "HORA"

    const pricingRule = await PricingRuleModel.findActiveByCategoryAndTipo(
        parkingSession.vehicle.categoryId, 
        tipoCobranca
    )
    if(!pricingRule){
        throw new AppError(
            "Regra de cobrança não encontrada para essa categoria e tipo"
            ,404)
    }

    const saida = new Date()

    const tempoTotalMinutos = calculateMinutesBetween(
        parkingSession.entrada,
        saida
    )
    const valorTotal = calculateAmount(
        tempoTotalMinutos,
        Number(pricingRule.valor),
        pricingRule.tolerancia_minutos,
        tipoCobranca
    )
    const  closedParkingSession = await ParkinSessionModel.close(id,{
        saida,
        tempo_total_minutos: tempoTotalMinutos,
        valor_total: valorTotal,
        status: "FECHADO"
    })
    await ParkingSpotModel.update(parkingSession.parkingSpotId,{
        status:"DISPONIVEL",
    })
    return closedParkingSession
  },

  async cencel(id: string){
    const parkingSession = await ParkinSessionModel.findById(id)

    if(!parkingSession){
        throw new AppError("Estacionamento não encontrado",404)
    }
    if(parkingSession.status !== "ABERTO"){
        throw new AppError("Somente estacionamento aberto pode ser cancelado",400)
    }

    const canceledParkingSession = await ParkinSessionModel.cencel(id)
    
    await ParkingSpotModel.update(parkingSession.parkingSpotId,{
        status: "DISPONIVEL"
    })

    return canceledParkingSession
  }
};
