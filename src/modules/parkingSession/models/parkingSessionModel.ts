import { Prisma, ParkingSessionStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { CreateParkingSessionDTO } from "../dtos/createParkingSessionDto";
import { create } from "node:domain";
import { Session } from "node:inspector";

export function formatDateBrasil(data: Date | string): string {
  return new Intl.DateTimeFormat("pt-Br", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(data));
}

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

  async periodTotals(start: Date, end: Date) {
    const range = { gte: start, lt: end };
    return prisma.$transaction(async tx => {
      const counts = await tx.parkingSession.groupBy({ by: ["status"], where: { entrada: range }, _count: true });
      const revenue = await tx.parkingSession.aggregate({
        where: { saida: range, status: "FECHADO" }, _sum: { valor_total: true },
      });
      const totals = { entries: 0, ABERTO: 0, FECHADO: 0, CANCELADO: 0, revenue: Number(revenue._sum.valor_total ?? 0) };
      for (const row of counts) {
        totals.entries += row._count;
        totals[row.status] = row._count;
      }
      return totals;
    }, { isolationLevel: "RepeatableRead" });
  },

  async findPage(requestedPage: number, search: string) {
    const pageSize = 10;
    const contains = search.replace(/[\\%_]/g, "\\$&");
    const text = { contains, mode: "insensitive" as const };
    const where: Prisma.ParkingSessionWhereInput = search
      ? {
          OR: [
            { vehicle: { placa: text } },
            { vehicle: { client: { name: text } } },
            { parkingSpot: { numero: text } },
            { parkingSpot: { patio: text } },
            {
              status: {
                in: Object.values(ParkingSessionStatus).filter((status) =>
                  status.includes(search.toUpperCase()),
                ),
              },
            },
          ],
        }
      : {};

    return prisma.$transaction(
      async (tx) => {
        const counts = await tx.parkingSession.groupBy({
          by: ["status"],
          _count: true,
        });
        const summary = { ABERTO: 0, FECHADO: 0, CANCELADO: 0 };
        for (const row of counts) summary[row.status] = row._count;
        const total = search
          ? await tx.parkingSession.count({ where })
          : summary.ABERTO + summary.FECHADO + summary.CANCELADO;
        const totalPages = Math.ceil(total / pageSize);
        const page = Math.min(requestedPage, Math.max(1, totalPages));
        const items = await tx.parkingSession.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          include: {
            vehicle: { include: { client: true, category: true } },
            parkingSpot: true,
          },
        });
        return { items, page, totalPages, total, summary };
      },
      { isolationLevel: "RepeatableRead" },
    );
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
    // 1. Verifica se o veículo já está estacionado
    const sessaoAberta = await prisma.parkingSession.findFirst({
      where: {
        vehicleId: data.vehicleId,
        status: "ABERTO",
      },
    });

    if (sessaoAberta) {
      throw new Error(
        "Este veículo já possui uma sessão de estacionamento aberta.",
      );
    }

    // 2. Cria a sessão no banco
    const session = await prisma.parkingSession.create({
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

    // 3. Retorna os dados com a data formatada
    return {
      ...session,
      entradaFormatada: formatDateBrasil(session.entrada),
    };
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
