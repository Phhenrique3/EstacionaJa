import bcrypt from "bcrypt";
import { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";

import { RegisterDto } from "../dtos/auth/authDtos";
import { UserModel } from "../../models/userModel";
import AppError from "../../../middlewares/appError";

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
};