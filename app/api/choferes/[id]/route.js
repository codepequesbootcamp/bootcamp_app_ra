import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request, { params }) {
  const { id } = await params;
  const chofer = await prisma.drivers.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(chofer);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const chofer = await prisma.drivers.update({
    where: { id: Number(id) },
    data: body,
  });
  return NextResponse.json(chofer);
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  await prisma.drivers.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ ok: true });
}
