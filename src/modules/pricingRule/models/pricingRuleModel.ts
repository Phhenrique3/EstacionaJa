import { create } from "node:domain"
import { prisma } from "../../../config/prisma"
import { CreatePricingRuleDTO } from "../dtos/createPricingRuleDto"

export const PricingRuleModel = {
    async findByid(id: string){
        return prisma.pricingRule.findUnique({
            where: {
                id,
            }
        })
    },


    async findByCategory(categoryId:string){

        return prisma.pricingRule.findMany({
            where:{
                categoryId,
            },
            orderBy:{
                createdAt: "desc"
            } ,

            include:{
                category: true,
            }
        })
    },


    async findActiveByCategoryAndTipo(categoryId: string, tipo_cobranca: CreatePricingRuleDTO["tipo_cobranca"]){

        return prisma.pricingRule.findFirst({
            where:{
                categoryId,
                tipo_cobranca,
                active: true
            }
        })
    },


    async findAll(){
        return prisma.pricingRule.findMany({
        
            orderBy:{
                createdAt: "desc"
            },
            include:{
                category: true
            }
        })
    },

    async create(data: CreatePricingRuleDTO){
        return prisma.pricingRule.create({
            data,
            include:{
                category: true
            }
        })
    },

    async delete(id:string){
        return prisma.pricingRule.delete({

            where:{
                id,
            }
        })
    }

}