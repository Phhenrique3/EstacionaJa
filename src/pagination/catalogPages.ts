import { ParkingSpotStatus, Prisma, TipoCobranca, TipoDocumento } from "@prisma/client";
import type { Request } from "express";
import { prisma } from "../config/prisma";
import AppError from "../middlewares/AppError";

export function parsePage(query: Request["query"]) {
  const { page, search = "", scope = "" } = query;
  if (typeof page !== "string" || !/^[1-9]\d*$/.test(page) ||
      !Number.isSafeInteger(Number(page)) || typeof search !== "string" || typeof scope !== "string") {
    throw new AppError("Página ou busca inválida.", 400);
  }
  return { page: Number(page), search: search.trim(), scope };
}

type Query = ReturnType<typeof parsePage>;
type Resource = "client" | "vehicleCategory" | "parkingSpot" | "pricingRule" | "vehicle";

async function readPage<T>(requested: number, total: number, read: (skip: number, take: number) => Promise<T[]>) {
  const totalPages = Math.ceil(total / 10);
  const page = Math.min(requested, Math.max(1, totalPages));
  return { items: await read((page - 1) * 10, 10), page, totalPages, total };
}

export function catalogPage(resource: Resource, { page, search, scope }: Query) {
  const term = search.toLowerCase();
  const text = { contains: search.replace(/[\\%_]/g, "\\$&"), mode: "insensitive" as const };
  const activeOnly = scope === "active" || (scope === "active-default" && !search);
  const activity = [true, false].filter(active => (active ? "ativo" : "inativo").includes(term));
  const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }];
  return prisma.$transaction(async tx => {
    switch (resource) {
      case "client": {
        const where: Prisma.ClientWhereInput = { active: activeOnly ? true : undefined,
          OR: search ? [{ name: text }, { email: text }, { telefone: text }, { documento: text },
            { tipo_documento: { in: Object.values(TipoDocumento).filter(v => v.toLowerCase().includes(term)) } },
            ...activity.map(active => ({ active }))] : undefined };
        return readPage(page, await tx.client.count({ where }), (skip, take) =>
          tx.client.findMany({ where, skip, take, orderBy }));
      }
      case "vehicleCategory": {
        const where: Prisma.VehicleCategoryWhereInput = { active: activeOnly ? true : undefined,
          OR: search ? [{ name: text }, { description: text }, ...activity.map(active => ({ active }))] : undefined };
        return readPage(page, await tx.vehicleCategory.count({ where }), (skip, take) =>
          tx.vehicleCategory.findMany({ where, skip, take, orderBy }));
      }
      case "parkingSpot": {
        const where: Prisma.ParkingSpotWhereInput = { status: scope === "available" ? "DISPONIVEL" : undefined,
          OR: search ? [{ numero: text }, { patio: text }, { status: { in:
            Object.values(ParkingSpotStatus).filter(v => v.toLowerCase().includes(term)) } }] : undefined };
        const result = await readPage(page, await tx.parkingSpot.count({ where }), (skip, take) =>
          tx.parkingSpot.findMany({ where, skip, take, orderBy }));
        if (scope === "available") return result;
        const counts = await tx.parkingSpot.groupBy({ by: ["status"], _count: true });
        const summary: Record<string, number> = { total: 0 };
        for (const row of counts) { summary[row.status] = row._count; summary.total += row._count; }
        return { ...result, summary };
      }
      case "vehicle": {
        const eligible = { parkingSessions: { none: { status: "ABERTO" as const } } };
        const where: Prisma.VehicleWhereInput = { ...eligible, OR: search ? [{ placa: text }, { marca: text },
          { modelo: text }, { cor: text }, { client: { name: text } }, { category: { name: text } }] : undefined };
        const result = await readPage(page, await tx.vehicle.count({ where }), (skip, take) =>
          tx.vehicle.findMany({ where, skip, take, orderBy, include: { client: true, category: true } }));
        if (scope === "available") return result;
        const groups = await tx.vehicle.groupBy({ by: ["categoryId"], where: eligible, _count: true });
        return { ...result, summary: { total: groups.reduce((n, g) => n + g._count, 0), categories: groups.length } };
      }
      case "pricingRule": {
        const where: Prisma.PricingRuleWhereInput = { OR: search ? [{ category: { name: text } },
          { tipo_cobranca: { in: Object.values(TipoCobranca).filter(v => v.toLowerCase().includes(term)) } },
          ...activity.map(active => ({ active }))] : undefined };
        if (/^[\d.]+$/.test(search)) {
          // A busca por preço aceita uma parte do valor, como na listagem original.
          const from = Prisma.sql`FROM "PricingRule" r JOIN "VehicleCategory" c ON c.id = r."categoryId"
            WHERE strpos(trim_scale(r.valor)::text, ${search}) > 0 OR strpos(c.name, ${search}) > 0`;
          const [count] = await tx.$queryRaw<{ total: bigint }[]>`SELECT COUNT(*) AS total ${from}`;
          return readPage(page, Number(count.total), async (skip, take) => {
            const ids = await tx.$queryRaw<{ id: string }[]>`SELECT r.id ${from}
              ORDER BY r."createdAt" DESC, r.id DESC LIMIT ${take} OFFSET ${skip}`;
            return tx.pricingRule.findMany({ where: { id: { in: ids.map(row => row.id) } },
              orderBy, include: { category: true } });
          });
        }
        return readPage(page, await tx.pricingRule.count({ where }), (skip, take) =>
          tx.pricingRule.findMany({ where, skip, take, orderBy, include: { category: true } }));
      }
    }
  }, { isolationLevel: "RepeatableRead" });
}
