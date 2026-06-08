import { prisma } from "../../../config/prisma"
import { CreateVehicleCategoryDto } from "../dtos/createVehicleCategoryDto"


export const vehicleCategoryModel={
    async findById(id: string){
        return prisma.vehicleCategory.findUnique({
            where:{
                id,
            }
        })
    },


    async findName(name: string) {
        return prisma.vehicleCategory.findUnique({
            where:{
                name,
            }
        })
    },


    async findAll(){
        return prisma.vehicleCategory.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
    } ,

    async create(data: CreateVehicleCategoryDto){
        return prisma.vehicleCategory.create({
            data,
        })
    },


    async update(id: string, data: Partial<CreateVehicleCategoryDto>){
            return prisma.vehicleCategory.update({
                where: {
                    id,
                },
                data,
            })
    },

    async delete(id: string){
    return prisma.vehicleCategory.delete({
        where:{
            id,
        }
    })
    }
}