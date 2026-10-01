import { ClientModel } from "../../client/models/clientModel";
import { VehicleCategoryController } from "../../vehicleCategory/controller/vehicleCategoryController";
import { vehicleCategoryModel } from "../../vehicleCategory/models/vehicleCategoryModel";
import { CreateVehicleDTO } from "../dtos/CreateVehicleDTO";
import AppError from "../../../middlewares/AppError";
import { vehicleModel } from "../models/vehicleModel";
import { updateVehicleDTO } from "../dtos/updateVehicleDTO";

export const vehicleService = {
  async create(dto: CreateVehicleDTO) {
    const placa = dto.placa.trim().toUpperCase();

    const vehicleAlreadyExists = await vehicleModel.findByPlaca(placa);

    if (vehicleAlreadyExists) {
      throw new AppError("Veiculo já cadastro com essa placa", 409);
    }

    const client = await ClientModel.findById(dto.clientId);

    if (!client) {
      throw new AppError("Cliente Não encontrado(A)", 404);
    }

    const category = await vehicleCategoryModel.findById(dto.categoryId);

    if (!category) {
      throw new AppError("Categoria de veiculo não encontrada", 404);
    }
    if (!category.active) {
      throw new AppError("Categoria no veiculo está inativa", 400);
    }

    const vehicle = await vehicleModel.create({
      placa,
      marca: dto.marca?.trim(),
      modelo: dto.modelo?.trim(),
      cor: dto.cor?.trim(),
      clientId: dto.clientId,
      categoryId: dto.categoryId,
    });
    return vehicle;
  },

  async findAll() {
    const vehicle = await vehicleModel.findAll();
    return vehicle;
  },

  async findById(id: string) {
    const vehicle = await vehicleModel.findById(id);

    if (!vehicle) {
      throw new AppError("Veículo não encontrado", 404);
    }
    return vehicle;
  },

  async delete(id: string) {
    const vehicle = await vehicleModel.findById(id);

    if (!vehicle) {
      throw new AppError("Veiculo não encontrado", 404);
    }

    await vehicleModel.delete(id);

    return {
      message: "Veículo removido com sucesso",
    };
  },

  async update(id: string, dto: updateVehicleDTO) {
    const vehicle = await vehicleModel.findById(id);

    if (!vehicle) {
      throw new AppError("Veículo não encontrado", 404);
    }

    const data: updateVehicleDTO = {};

    if (dto.placa !== undefined) {
      data.placa = dto.placa.trim().toUpperCase();
    }

    if (dto.marca !== undefined) {
      data.marca = dto.marca.trim();
    }

    if (dto.modelo !== undefined) {
      data.modelo = dto.modelo.trim();
    }

    if (dto.cor !== undefined) {
      data.cor = dto.cor.trim();
    }

    if (dto.categoryId !== undefined) {
      data.categoryId = dto.categoryId.trim();
    }

    if (dto.clientId !== undefined) {
      data.clientId = dto.clientId.trim();
    }

    return vehicleModel.update(id, data);
  },
};
