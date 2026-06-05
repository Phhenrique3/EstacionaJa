import { TipoDocumento } from "@prisma/client";

export interface ClientResponseDTO {
  id: string;
  name: string;
  email: string | null;
  telefone: string;
  tipo_documento: TipoDocumento;
  documento: string;
  createdAt: Date;
  updatedAt: Date;
}