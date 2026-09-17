import { TipoDocumento } from "@prisma/client";

export interface updateClientDto {
  name?: string;
  email: string ;
  telefone: string;
  tipo_documento: TipoDocumento;
  documento: string;
  createdAt: Date;
  updatedAt: Date;
  active?: boolean;
}
