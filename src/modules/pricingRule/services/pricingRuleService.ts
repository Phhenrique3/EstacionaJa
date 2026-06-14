import { create } from "node:domain";
import { CreatePricingRuleDTO } from "../dtos/createPricingRuleDto";
import { VehicleCategoryController } from "../../vehicleCategory/controller/vehicleCategoryController";
import { vehicleCategoryModel } from "../../vehicleCategory/models/vehicleCategoryModel";
import AppError from "../../../middlewares/AppError";
import { PricingRuleModel } from "../models/pricingRuleModel";

export const pricingRuleService = {
    async create(dto:CreatePricingRuleDTO ){
        const category = await vehicleCategoryModel.findById(dto.categoryId)

        if(!category){
            throw new AppError(
                "Categoria de veículo não encontrada",
                400
            )
        }
        const activeRuleAlreadyExists = 
        await PricingRuleModel.findActiveByCategoryAndTipo(
            dto.categoryId,
            dto.tipo_cobranca
        )

        if(activeRuleAlreadyExists){
            throw new AppError(
                "Já exite um regra de cobrança ativa para esse categoria e tipo",
                409
            )
        }

        const pricingRule = await PricingRuleModel.create({
            categoryId: dto.categoryId,
            tipo_cobranca : dto.tipo_cobranca,
            valor: dto.valor,
            tolerancia_minutos: dto.tolerancia_minutos ?? 0
        })

        return pricingRule
    },

    async findAll(){
        const pricingRule = await PricingRuleModel.findAll()

        return pricingRule
    },

    async findById(id: string){
        const pricingRule = await PricingRuleModel.findByid(id)

        if(!pricingRule){
            throw new AppError(
                "Regra de cobrança não encontrada",
                404
            )
        }
    },

     async findByCategoryId(categoryId: string) {
    const category = await vehicleCategoryModel.findById(categoryId);

    if (!category) {
      throw new AppError("Categoria de veículo não encontrada", 404);
    }

    const pricingRules = await PricingRuleModel.findByCategory(categoryId);
    return pricingRules;
  },

  async update(id: string, dto: Partial<CreatePricingRuleDTO>){
    const pricingRule = await PricingRuleModel.findByid(id)

    if(!pricingRule){
        throw new AppError(
            "Categoria de veículo não encontrado",
            404
        )
    }

    if(!dto.categoryId){
        throw new AppError(
            "Categoria de veículo está inativa",
            404
        )
    }
    const categoryId = dto.categoryId ?? pricingRule.categoryId;
    const tipo_cobranca = dto.tipo_cobranca ?? pricingRule.tipo_cobranca;

    if(dto.categoryId || dto.tipo_cobranca){
        const activeRuleAlreadyExists = 
        await PricingRuleModel.findActiveByCategoryAndTipo(
            categoryId,
            tipo_cobranca,
        )

        if(
            activeRuleAlreadyExists && activeRuleAlreadyExists.id !== id
        ){
            throw new AppError(
                "Já existe um regra de cobrança ativa para essa categoria e tipo",
                409
            )
        }
    }
      const updatePricingRule = await PricingRuleModel.update(id,dto)

    return updatePricingRule
  },

  async delete(id:string){
    const pricingRule = await PricingRuleModel.findByid(id)

    if(!pricingRule){
        throw new AppError(
            "Regra de cobrança não encontrada",
            404
        )
    }
    await PricingRuleModel.delete(id)
    return{
        message: "Regra de cobrança removida com sucesso",
    }
}
}