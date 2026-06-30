import { TipoCobranca } from "@prisma/client";

export interface CloseParkingSessionDTO{
    tipo_cobranca?: TipoCobranca
}