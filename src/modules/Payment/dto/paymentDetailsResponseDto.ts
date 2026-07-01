import { PaymentMethod, ParkingSessionStatus } from "@prisma/client";

export interface PaymentDetailsResponseDTO {
  id: string;
  parkingSessionId: string;
  metodo_pagamento: PaymentMethod;
  valor_pago: number;
  pago_em: Date;
  createdAt: Date;
  updatedAt: Date;

  parkingSession: {
    id: string;
    entrada: Date;
    saida: Date | null;
    tempo_total_minutos: number | null;
    valor_total: number | null;
    status: ParkingSessionStatus;

    vehicle: {
      id: string;
      placa: string;
      marca: string | null;
      modelo: string | null;
      cor: string | null;

      client: {
        id: string;
        name: string;
        telefone: string;
        documento: string;
      };
    };

    parkingSpot: {
      id: string;
      numero: string;
      patio: string | null;
    };
  };
}