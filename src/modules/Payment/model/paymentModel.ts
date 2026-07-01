import { PaymentMethod } from "@prisma/client";
import { prisma } from "../../../database/prisma";

interface CreatePaymentModelDTO { 
  parkingSessionId: string;
  metodo_pagamento: PaymentMethod;
  valor_pago: number;
}

export const PaymentModel = {
  async findById(id: string) {
    return prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        parkingSession: {
          include: {
            vehicle: {
              include: {
                client: true,
                category: true,
              },
            },
            parkingSpot: true,
          },
        },
      },
    });
  },

  async findByParkingSessionId(parkingSessionId: string) {
    return prisma.payment.findUnique({
      where: {
        parkingSessionId,
      },
      include: {
        parkingSession: {
          include: {
            vehicle: {
              include: {
                client: true,
                category: true,
              },
            },
            parkingSpot: true,
          },
        },
      },
    });
  },

  async findAll() {
    return prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        parkingSession: {
          include: {
            vehicle: {
              include: {
                client: true,
                category: true,
              },
            },
            parkingSpot: true,
          },
        },
      },
    });
  },

  async create(data: CreatePaymentModelDTO) {
    return prisma.payment.create({
      data,
      include: {
        parkingSession: {
          include: {
            vehicle: {
              include: {
                client: true,
                category: true,
              },
            },
            parkingSpot: true,
          },
        },
      },
    });
  },
};