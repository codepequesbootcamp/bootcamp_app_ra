-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drivers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "viajando" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Drivers" ("apellido", "documento", "id", "nombre", "telefono") SELECT "apellido", "documento", "id", "nombre", "telefono" FROM "Drivers";
DROP TABLE "Drivers";
ALTER TABLE "new_Drivers" RENAME TO "Drivers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
