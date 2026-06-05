import { prisma } from "../../../config/prisma";
import { UserRole } from "@prisma/client";

export const UserModel = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    return prisma.user.create({
      data,
    });
  },

  getAll(filters?: { name?: string; email?: string }) {
    return prisma.user.findMany({
      where: {
        ...(filters?.name && {
          name: {
            contains: filters.name,
            mode: "insensitive",
          },
        }),
        ...(filters?.email && {
          email: {
            contains: filters.email,
            mode: "insensitive",
          },
        }),
      },
    });
  },

  update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password: string;
      role: UserRole;
    }>
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};