import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const choferes = await prisma.drivers.findMany();
  return NextResponse.json(choferes);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const { nombre, apellido, documento, telefono } = body;

  if (
    typeof nombre !== "string" ||
    typeof apellido !== "string" ||
    typeof documento !== "string" ||
    typeof telefono !== "string" ||
    [nombre, apellido, documento, telefono].some((v) => v.trim() === "")
  ) {
    return NextResponse.json(
      { error: "Completa nombre, apellido, documento y teléfono" },
      { status: 400 }
    );
  }

  try {
    const chofer = await prisma.drivers.create({
      data: { nombre, apellido, documento, telefono },
    });
    return NextResponse.json(chofer, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un chofer con ese documento" },
        { status: 409 }
      );
    }
    throw error;
  }
}