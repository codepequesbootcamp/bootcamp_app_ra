import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const CAMPOS_EDITABLES = [
  "nombre",
  "apellido",
  "documento",
  "telefono",
  "viajando",
] as const;

function parseId(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = parseId(id);
  if (parsed === null) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }

  const chofer = await prisma.drivers.findUnique({ where: { id: parsed } });
  if (!chofer) {
    return NextResponse.json({ error: "Chofer no encontrado" }, { status: 404 });
  }
  return NextResponse.json(chofer);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = parseId(id);
  if (parsed === null) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const existe = await prisma.drivers.findUnique({
    where: { id: parsed },
    select: { id: true },
  });
  if (!existe) {
    return NextResponse.json({ error: "Chofer no encontrado" }, { status: 404 });
  }

  const data: {
    nombre?: string;
    apellido?: string;
    documento?: string;
    telefono?: string;
    viajando?: boolean;
  } = {};
  for (const campo of CAMPOS_EDITABLES) {
    const valor = body[campo];
    if (valor === undefined) continue;

    if (campo === "viajando") {
      if (typeof valor !== "boolean") {
        return NextResponse.json(
          { error: `El campo "viajando" debe ser booleano` },
          { status: 400 }
        );
      }
      data.viajando = valor;
    } else {
      if (typeof valor !== "string" || valor.trim() === "") {
        return NextResponse.json(
          { error: `El campo "${campo}" no es válido` },
          { status: 400 }
        );
      }
      data[campo] = valor;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No hay campos para actualizar" },
      { status: 400 }
    );
  }

  try {
    const chofer = await prisma.drivers.update({ where: { id: parsed }, data });
    return NextResponse.json(chofer);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe otro chofer con ese documento" },
        { status: 409 }
      );
    }
    throw error;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = parseId(id);
  if (parsed === null) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }

  const existe = await prisma.drivers.findUnique({
    where: { id: parsed },
    select: { id: true },
  });
  if (!existe) {
    return NextResponse.json({ error: "Chofer no encontrado" }, { status: 404 });
  }

  await prisma.drivers.delete({ where: { id: parsed } });
  return NextResponse.json({ ok: true });
}