export interface VehicleWithRelationsResponseDTO{
    id: string;
    placa: string;
    marca: string | null;
    modelo: string | null;
    cor:string | null;



    client:{
    id: string;
    name: string;
    documento: string;
    telefone: string;
    };

    category: {
    id: string;
    name: string;
  };

createdAt: Date;
  updatedAt: Date;
    
}