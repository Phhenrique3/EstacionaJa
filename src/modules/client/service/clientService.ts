import { CreateClientDTO } from "../dtos/createClientDto";
import { ClientModel } from "../models/clientModel";
import AppError from "../../../middlewares/AppError";

export const clientService = {
  async create(dto: CreateClientDTO) {
    const clientAlreadyExists = await ClientModel.findByDocumento(
      dto.documento
    );

    if (clientAlreadyExists) {
      throw new AppError("Cliente já cadastrado com esse documento", 409);
    }

    const client = await ClientModel.create({
      name: dto.name.trim(),
      email: dto.email?.trim().toLowerCase(),
      telefone: dto.telefone.trim(),
      tipo_documento: dto.tipo_documento,
      documento: dto.documento.trim(),
    });

    return client;
  },

  async findAll() {
    const clients = await ClientModel.findAll();

    return clients;
  },

  async findById(id: string) {
    const client = await ClientModel.findById(id);

    if (!client) {
      throw new AppError("Cliente não encontrado", 404);
    }

    return client;
  },

  async update(id: string, dto: Partial<CreateClientDTO>) {
    const client = await ClientModel.findById(id);

    if (!client) {
      throw new AppError("Cliente não encontrado", 404);
    }

    const data: Partial<CreateClientDTO> = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      data.email = dto.email.trim().toLowerCase();
    }

    if (dto.telefone !== undefined) {
      data.telefone = dto.telefone.trim();
    }

    if (dto.tipo_documento !== undefined) {
      data.tipo_documento = dto.tipo_documento;
    }

    if (dto.documento !== undefined) {
      const documento = dto.documento.trim();

      const documentAlreadyExists = await ClientModel.findByDocumento(
        documento
      );

      if (documentAlreadyExists && documentAlreadyExists.id !== id) {
        throw new AppError("Já existe outro cliente com esse documento", 409);
      }

      data.documento = documento;
    }

    const updatedClient = await ClientModel.update(id, data);

    return updatedClient;
  },

  async delete(id: string) {
    const client = await ClientModel.findById(id);

    if (!client) {
      throw new AppError("Cliente não encontrado", 404);
    }

    await ClientModel.delete(id);

    return {
      message: "Cliente removido com sucesso",
    };
  },
};