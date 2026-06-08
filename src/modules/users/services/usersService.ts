import bcrypt from "bcrypt";
import { sign, SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";

import { AuthResponseDTO, LoginDto, RegisterDto } from "../dtos/auth/authDtos";
import { UserModel } from "../models/userModel";
import AppError from "../../../middlewares/AppError";
import { AuthResponse } from "@supabase/supabase-js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const JWT_OPTIONS: SignOptions = {
  expiresIn: process.env.JWT_EXPIRES
    ? parseInt(process.env.JWT_EXPIRES, 10)
    : 86400,
};

export const usersService = {
  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existe = await UserModel.findByEmail(email);

    if (existe) {
      throw new AppError("Email já cadastrado", 409);
    }

    const password = await bcrypt.hash(dto.password, 10);

    const user = await UserModel.create({
      name: dto.name.trim(),
      email,
      password,
        role: dto.role ?? UserRole.ADMIN,

    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },


  async login(dto: LoginDto): Promise<AuthResponseDTO> {
    
    const email = dto.email.trim().toLowerCase();
    const user = await UserModel.findByEmail(email);
    if(!user) throw new AppError("Cradenciais invalida",401)

      const ok = await bcrypt.compare(dto.password, user.password)
      if(!ok) throw new AppError("Cradenciais invalida",401)

        const token = sign({sub:user.id},JWT_SECRET,JWT_OPTIONS)
        
        return { token}

  }
};

