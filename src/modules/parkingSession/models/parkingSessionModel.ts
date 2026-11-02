import { ParkingSessionStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { CreateParkingSessionDTO } from "../dtos/createParkingSessionDto";
import { create } from "node:domain";

export const ParkingSessionModel = {
  async findById(id: string) {
    return prisma.parkingSession.findUnique({
      where: {
        id,
      },
      include: {
        vehicle: {
          include: {
            client: true,
            category: true,
          },
        },
        parkingSpot: true,
      },
    });
  },

  async findAll() {
    return prisma.parkingSession.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vehicle: {
          include: {
            client: true,
            category: true,
          },
        },
        parkingSpot: true,
      },
    });
  },

  async findOpenByVehicleId(vehicleId: string) {
    return prisma.parkingSession.findFirst({
      where: {
        vehicleId,
        status: "ABERTO",
      },
    });
  },

  async findOpenByParkingSpotId(parkingSpotId: string) {
    return prisma.parkingSession.findFirst({
      where: {
        parkingSpotId,
        status: "ABERTO",
      },
    });
  },

async create(data: CreateParkingSessionDTO) {

  const sessaoAberta = await prisma.parkingSession.findFirst({
    where: {
      vehicleId: data.vehicleId,
      status: "ABERTO",
    },
  });

  if (sessaoAberta) {
    throw new Error(
      "Este veículo já possui uma sessão de estacionamento aberta."
    );
  }

  return prisma.parkingSession.create({
    data,
    include: {
      vehicle: {
        include: {
          client: true,
          category: true,
        },
      },
      parkingSpot: true,
    },
  });
},

  async close(
    id: string,
    data: {
      saida: Date;
      tempo_total_minutos: number;
      valor_total: number;
      status: ParkingSessionStatus;
    },
  ) {
    return prisma.parkingSession.update({
      where: {
        id,
      },
      data,
      include: {
        vehicle: {
          include: {
            client: true,
            category: true,
          },
        },
        parkingSpot: true,
      },
    });
  },

  async cancel(id: string) {
    return prisma.parkingSession.update({
      where: {
        id,
      },
      data: {
        status: "CANCELADO",
      },
      include: {
        vehicle: {
          include: {
            client: true,
            category: true,
          },
        },
        parkingSpot: true,
      },
    });
  },
};
