import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  // O adaptador do Prisma interpreta os timestamps retornados pelo PostgreSQL como UTC.
  options: "-c timezone=UTC",
});

export const prisma = new PrismaClient({
  adapter,
});
