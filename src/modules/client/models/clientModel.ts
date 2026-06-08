import { SrvRecord } from "node:dns"
import { prisma } from "../../../config/prisma"
import { CreateClientDTO } from "../dtos/createClientDto"

export const ClientModel = {
    async findBy(id: string){
        return prisma.client.findUnique({
            where:{
                id,
            }
        })
    },

    async findByDocumento(documento: string){
        return prisma.client.findUnique({
            where: {
                documento,
            }
        })

    },

    async findById(id: string){
        return prisma.client.findUnique({
            where:{
                id,
            }
        })
    },

    async findAll(){
        return prisma.client.findMany({
            orderBy:{
                createdAt: "desc",
            }
        })
    },

     async create(data: CreateClientDTO ){
        return prisma.client.create({
            data,
        })
    },

    async update(id: string, data: Partial<CreateClientDTO>){
        return prisma.client.update({
            where:{
                id,
            },
            data,
        })
    },

    async delete (id: string){
        return prisma.client.delete({
            where:{
                id,
            }
        })
    }
}

