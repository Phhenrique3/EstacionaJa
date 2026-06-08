export interface VehicleResponseDTO {
  id: string;
  placa: string;
  marca: string | null;
  modelo: string | null;
  cor: string | null;
  clientId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}