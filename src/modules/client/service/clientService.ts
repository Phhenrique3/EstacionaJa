import { create } from "node:domain";
import { CreateClientDTO } from "../dtos/createClientDto";
import { ClientModel } from "../models/clientModel";
import AppClinete from "../../../middlewares/AppError";

export const clientService ={
    async create(dto: CreateClientDTO){
        const clientAlreadyExists = await ClientModel.findByDocumento(
            dto.documento
        )

        if(clientAlreadyExists){
            throw new AppClinete("Cliente já cadastrado com esse documentos", 409)
        }

        const client = await ClientModel.create({
        name: dto.name,
        email: dto.email,
        telefone: dto.telefone,
        tipo_documento: dto.tipo_documento,
        documento: dto.documento,
        });
        return client
    },

    async findAll(){
        const clients = await ClientModel.findAll()

        return clients
    }, 
     async findById(id: string){
        const client = await ClientModel.findBy(id)

        if(!client){
            throw new AppClinete("Cliente não encontrado", 404)
        }
        return client
     },

     async delete(id: string){
        const client = await ClientModel.findBy(id)

        if(!client){
            throw new AppClinete("cliente não encontrado",404)
        }
        await ClientModel.delete(id)
        return {
              message: "Cliente removido com sucesso",
        }
     }

     
    
}