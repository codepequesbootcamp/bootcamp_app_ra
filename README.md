# bootcamp_app_ra

Pequeña aplicación de gestión de choferes construida con Next.js (App Router), React y Prisma ORM sobre SQLite.

## Puesta en marcha

Instala las dependencias y genera el cliente de Prisma (se ejecuta automáticamente con `postinstall`):

```bash
npm install
```

Crea la base de datos (`dev.db`) aplicando las migraciones:

```bash
npm run db:migrate
```

Arranca el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: servidor de desarrollo.
- `npm run build`: genera el cliente de Prisma (`prebuild`) y compila la app.
- `npm run start`: sirve la compilación de producción.
- `npm run lint`: eslint.
- `npm run db:migrate`: aplica las migraciones `prisma/migrations` a la base.
- `npx prisma studio`: explora los datos de la base.

## Estructura

- `app/api/*` — Route Handlers (API) que consumen Prisma (`name="drivers"`).
- `app/choferes/*` — páginas del directorio de choferes.
- `lib/prisma.ts` — instancia del `PrismaClient` con el adaptador `better-sqlite3`.
- `prisma/schema.prisma` — esquema de datos.