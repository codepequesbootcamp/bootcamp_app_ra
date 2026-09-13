"use strict";

require("dotenv/config");
const { createClient } = require("@libsql/client");
const Database = require("better-sqlite3");
const { createHash, randomUUID } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error("Faltan TURSO_DATABASE_URL / TURSO_AUTH_TOKEN en el entorno.");
  process.exit(1);
}

const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });

const MIGRATIONS_TABLE = `CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" VARCHAR(36) PRIMARY KEY NOT NULL,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" DATETIME,
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" DATETIME,
  "started_at" DATETIME NOT NULL DEFAULT current_timestamp,
  "applied_steps_count" INTEGER UNSIGNED NOT NULL DEFAULT 0
)`;

async function applyMigrations() {
  await client.execute(MIGRATIONS_TABLE);

  const dir = path.join(__dirname, "migrations");
  const folders = fs
    .readdirSync(dir)
    .filter((name) => fs.statSync(path.join(dir, name)).isDirectory())
    .sort();

  for (const folder of folders) {
    const exists = await client
      .execute({
        sql: `SELECT COUNT(*) AS n FROM "_prisma_migrations" WHERE "migration_name" = ?`,
        args: [folder],
      })
      .then((res) => Number(res.rows[0].n) > 0);

    if (exists) {
      console.log(`- ${folder}: ya aplicada, se omite`);
      continue;
    }

    const sql = fs.readFileSync(path.join(dir, folder, "migration.sql"), "utf8");
    await client.executeMultiple(sql);

    const checksum = createHash("sha256").update(sql).digest("hex");
    await client.execute({
      sql: `INSERT INTO "_prisma_migrations"
        ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
        VALUES (?, ?, ?, ?, ?, 1)`,
      args: [randomUUID(), checksum, new Date().toISOString(), folder, new Date().toISOString()],
    });
    console.log(`+ ${folder}: aplicada`);
  }
}

async function copyData() {
  const root = path.join(__dirname, "..");
  const dbFile = path.join(root, "dev.db");
  if (!fs.existsSync(dbFile)) {
    console.log("dev.db no encontrado, sin datos que copiar.");
    return;
  }

  const count = await client
    .execute(`SELECT COUNT(*) AS n FROM "Drivers"`)
    .then((res) => Number(res.rows[0].n));

  if (count > 0) {
    console.log(`Turso ya tiene ${count} choferes, no se copian datos.`);
    return;
  }

  const local = new Database(dbFile);
  const rows = local
    .prepare(`SELECT "id", "nombre", "apellido", "documento", "telefono", "viajando" FROM "Drivers"`)
    .all();
  local.close();

  if (rows.length === 0) {
    console.log("dev.db no tiene choferes, nada que copiar.");
    return;
  }

  await client.batch(
    rows.map((r) => ({
      sql: `INSERT INTO "Drivers" ("nombre", "apellido", "documento", "telefono", "viajando")
        VALUES (?, ?, ?, ?, ?)`,
      args: [r.nombre, r.apellido, r.documento, r.telefono, r.viajando ? 1 : 0],
    }))
  );
  console.log(`Copiados ${rows.length} choferes desde dev.db a Turso.`);
}

async function main() {
  console.log("Aplicando migraciones a Turso...");
  await applyMigrations();
  console.log("Copiando datos...");
  await copyData();
  await client.close();
  console.log("Listo.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});