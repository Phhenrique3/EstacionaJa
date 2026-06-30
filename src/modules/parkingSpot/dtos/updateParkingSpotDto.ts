import { ParkingSpotStatus } from "@prisma/client";

export interface UpdateParkingSpotDTO{
    numero?:string,
    patio?: string,
    status?: ParkingSpotStatus
}