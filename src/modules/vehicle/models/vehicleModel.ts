import { prisma } from "../../../config/prisma";
import { CreateVehicleDTO } from "../dtos/CreateVehicleDTO";
import { VehicleResponseDTO } from "../dtos/VehicleResponseDTO";

export const vehicleModel = {
  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: {
        id,
      },
    });
  },

  async findByPlaca(placa: string) {
    return prisma.vehicle.findUnique({
      where: {
        placa,
      },
    });
  },

  async findAll() {
    return prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: true,
        category: true,
      },
    });
  },

  async create(data: CreateVehicleDTO) {
    return prisma.vehicle.create({
      data,
      include: {
        client: true,
        category: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.vehicle.delete({
      where: {
        id,
      },
    });
  },

  async update(id: string, data: Partial<VehicleResponseDTO>) {
    return prisma.vehicle.update({
      where: {
        id,
      },
      data,
    });
  },
};
