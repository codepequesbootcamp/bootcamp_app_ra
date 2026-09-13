import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/app/generated/prisma/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error(
    "Faltan las variables TURSO_DATABASE_URL / TURSO_AUTH_TOKEN"
  );
}

const adapter = new PrismaLibSql({ url, authToken });

const globalForPrisma = globalThis as unknown as {
  prismaClientV3?: PrismaClient;
};

export const prisma =
  globalForPrisma.prismaClientV3 ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaClientV3 = prisma;
}