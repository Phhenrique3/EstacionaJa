import { SrvRecord } from "node:dns"

export interface CreateUsersDto{
    name: string
    email: string
    password: string
        role?: "USER" | "ADMIN";

    
}