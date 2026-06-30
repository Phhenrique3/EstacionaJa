import { prisma } from "../../../config/prisma"
import { CreateParkingSpotDto } from "../dtos/createParkingSpotDto"
import { UpdateParkingSpotDTO } from "../dtos/updateParkingSpotDto";

export const ParkingSpotModel = {
    async findById(id: string){
        return prisma.parkingSpot.findUnique({
            where:{
                id,
            }
        })
    },

    async findByNumero(numero : string){
        return prisma.parkingSpot.findUnique({
            where:{
                numero,
            }
        })
    },

    async findAll(){
        return prisma.parkingSpot.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
    },

    async create(data: CreateParkingSpotDto){
        return prisma.parkingSpot.create({
            data,
        })
    },

    
  async update(id: string, data: UpdateParkingSpotDTO) {
    return prisma.parkingSpot.update({
      where: {
        id,
      },
      data,
    });
  },

    async delete(id: string){
        return prisma.parkingSpot.delete({
            where:{
                id,
            }
        })
    }
}
