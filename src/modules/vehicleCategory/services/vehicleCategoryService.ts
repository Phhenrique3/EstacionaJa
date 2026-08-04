import { CreateVehicleCategoryDto } from "../dtos/createVehicleCategoryDto";
import { UpdateVehicleCategoryDto } from "../dtos/updateVehicleCategoryDto";
import { vehicleCategoryModel } from "../models/vehicleCategoryModel";
import AppError from "../../../middlewares/AppError";

export const vehicleCategoryService = {
  async create(dto: CreateVehicleCategoryDto) {
    const name = dto.name.trim();

    const categoryAlreadyExists = await vehicleCategoryModel.findName(name);

    if (categoryAlreadyExists) {
      throw new AppError("Categoria já cadastrada", 409);
    }

    const category = await vehicleCategoryModel.create({
      name,
      description: dto.description?.trim(),
    });

    return category;
  },

  async findAll() {
    const categories = await vehicleCategoryModel.findAll();

    return categories;
  },

  async findById(id: string) {
    const category = await vehicleCategoryModel.findById(id);

    if (!category) {
      throw new AppError("Categoria do veículo não encontrada", 404);
    }

    return category;
  },

  async update(id: string, dto: UpdateVehicleCategoryDto) {
    const category = await vehicleCategoryModel.findById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    if (dto.name !== undefined) {
      const categoryAlreadyExists = await vehicleCategoryModel.findName(
        dto.name
      );

      if (categoryAlreadyExists && categoryAlreadyExists.id !== id) {
        throw new AppError("Categoria já cadastrada", 409);
      }
    }

    const updatedCategory = await vehicleCategoryModel.update(id, dto);

    return updatedCategory;
  },

  async delete(id: string) {
    const category = await vehicleCategoryModel.findById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }

    if (category.active === false) {
      throw new AppError("Categoria já está desativada", 400);
    }

    await vehicleCategoryModel.delete(id);

    return {
      message: "Categoria desativada com sucesso",
    };
  },
};