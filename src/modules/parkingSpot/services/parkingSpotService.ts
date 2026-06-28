import { registry } from "zod"
import AppError from "../../../middlewares/AppError"
import { CreateParkingSpotDto } from "../dtos/createParkingSpotDto"
import { ParkingSpotModel } from "../models/parkingSpotModel"
import { CheckTypeParams } from "zod/v4/core"

export const parkingSpotService = {
    async create(dto: CreateParkingSpotDto){
        const numero = dto.numero.trim().toUpperCase()

        const parkingSpotAlreadyExists = await ParkingSpotModel.findByNumero(numero)

        if(parkingSpotAlreadyExists){
            throw new AppError("Vaga já cadastrado com esse número",409)
        }

        const parkingSpot = await ParkingSpotModel.create({
            numero,
            patio: dto.patio?.trim()
        })

        return parkingSpot
    },

    async findAll(){
        const parkingSpot = await ParkingSpotModel.findAll()

        return parkingSpot
    },

    async findById(id: string){
        const parkingSpot = await ParkingSpotModel.findById(id)

        if(!parkingSpot){
            throw new AppError("Vaga não encontrada",404)
        }

        return parkingSpot
    },

    async update(id: string, dto: Partial<CreateParkingSpotDto>){
        const parkingSpot = await ParkingSpotModel.findById(id)

        if(!parkingSpot){
            throw new AppError("Vaga não encontrada",404)
        }

        if(dto.numero){
            const numero = await dto.numero.trim().toUpperCase()

            const parkingSpotAlreadyExists = await ParkingSpotModel.findByNumero(numero)
            
            if(parkingSpotAlreadyExists && parkingSpotAlreadyExists.id !== id){
                throw new AppError("Vaga já cadastrado com esse número",409)
            }

            dto.numero = numero
        }

        if(dto.patio){
            dto.patio = dto.patio.trim()
        }

        const updateParkingSpot = await ParkingSpotModel.update(id,dto)

        return updateParkingSpot
     },

     async delete(id: string){
        const parkingSpot = await ParkingSpotModel.findById(id)

        if(!parkingSpot){
            throw new AppError("Vaga não encontrada",404)
        }

        await ParkingSpotModel.delete(id)

        return{
            message:
            "Vaga removida com sucesso"
        }
     }

}