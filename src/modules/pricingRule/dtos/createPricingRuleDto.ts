import { TipoCobranca } from "@prisma/client";


export interface CreatePricingRuleDTO {
  categoryId: string;
  tipo_cobranca: TipoCobranca;
  valor: number;
  tolerancia_minutos?: number;
}