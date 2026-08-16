import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const choferes = await prisma.drivers.findMany();
  return NextResponse.json(choferes);
}

export async function POST(request) {
  const body = await request.json();
  const chofer = await prisma.drivers.create({
    data: {
      nombre: body.nombre,
      apellido: body.apellido,
      documento: body.documento,
      telefono: body.telefono,
    },
  });
  return NextResponse.json(chofer, { status: 201 });
}
