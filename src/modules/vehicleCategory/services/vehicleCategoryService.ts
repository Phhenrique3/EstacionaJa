import { create } from "axios";
import { CreateVehicleCategoryDto } from "../dtos/createVehicleCategoryDto";
import { vehicleCategoryModel } from "../models/vehicleCategoryModel";
import AppError from "../../../middlewares/AppError";
import { Verify } from "crypto";
import { readSync } from "fs";


export const vehicleCategoryService ={ 
    async create(dto: CreateVehicleCategoryDto){
        const name = dto.name.trim()

        const categoryAlreadyExists = await vehicleCategoryModel.findName(name)

        if(categoryAlreadyExists){
            throw new AppError("Categoria já cadastrado com sucesso",400)
        }


        const category = await vehicleCategoryModel.create({
            name,
            description: dto.description?.trim()
        })

        return category
    },

    async findAll(){
        const categories = await vehicleCategoryModel.findAll()

        return categories
    },

    async findById(id: string){
        const category = await vehicleCategoryModel.findById(id)

        if(!category){
            throw new AppError("Categoria do veiculo não econtrado",400)
        }

        return category
    },

    async update(id: string, dto: Partial<CreateVehicleCategoryDto>){
        const category  = await vehicleCategoryModel.findById(id)

        if(!category){
            throw new AppError("Categoria de veículo não encontrado",404)
        }
        if(dto.name){
            const name = dto.name.trim()

            const categoryAlreadyExists = await vehicleCategoryModel.findName(name)
            if(categoryAlreadyExists &&  categoryAlreadyExists.id !== id){
                throw new AppError("Categoria de veículo já cadastrado",409)
            }

            dto.name = name
        }

        if(dto.description){
            dto.description = dto.description.trim()
            const updateCategory = await vehicleCategoryModel.update(id, dto)
            return updateCategory
        }
    },

    async delete(id: string){
        const category = await vehicleCategoryModel.findById(id)

        if(!category){
            throw new AppError("Categoria de veículo não encontrado", 404)
        }

        await vehicleCategoryModel.findById(id)

        return{
            message: "Categoria de veículo remivda com sucesso "
        }
    }
}