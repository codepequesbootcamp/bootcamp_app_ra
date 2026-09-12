import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const globalForPrisma = globalThis as unknown as {
  prismaClientV3?: PrismaClient;
};

export const prisma =
  globalForPrisma.prismaClientV3 ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaClientV3 = prisma;
}