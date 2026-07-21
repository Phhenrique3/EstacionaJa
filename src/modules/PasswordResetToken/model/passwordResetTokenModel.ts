import { prisma } from "../../../database/prisma";

export const PasswordResetTokenModel = {
  async create(data: {
    email: string;
    token: string;
    expiresAt: Date;
  }) {
    return prisma.passwordResetToken.create({
      data,
    });
  },

  async findValidToken(email: string, token: string) {
    return prisma.passwordResetToken.findFirst({
      where: {
        email,
        token,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async markAsUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: {
        id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  },
};