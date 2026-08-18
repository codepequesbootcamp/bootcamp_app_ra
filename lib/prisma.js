import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const globalForPrisma = globalThis;

if (!globalForPrisma.prismaClientV3) {
  globalForPrisma.prismaClientV3 = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prismaClientV3;
