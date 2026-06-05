import { TipoDocumento } from "@prisma/client";

export interface CreateClientDTO {
  name: string;
  email?: string;
  telefone: string;
  tipo_documento: TipoDocumento;
  documento: string;
}