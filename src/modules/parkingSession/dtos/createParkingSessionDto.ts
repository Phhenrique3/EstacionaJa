import { TipoCobranca } from "@prisma/client"

export interface CreateParkingSessionDTO {
    vehicleId: string
    parkingSpotId: string
    tipo_cobranca: TipoCobranca
}