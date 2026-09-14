import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const ROLES_VALIDOS = ["client", "admin", "super_admin"];
const ROLES_ADMIN = ["admin", "super_admin"];

function parseId(raw) {
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : null;
}

async function requiereAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  const id = Number(session);
  if (!Number.isInteger(id)) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true, enabled: true },
  });

  if (!user || !user.enabled || !ROLES_ADMIN.includes(user.role)) return null;

  return user;
}

export async function PATCH(request, { params }) {
  const admin = await requiereAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = parseId(id);
  if (parsed === null) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const data = {};

  if (body.enabled !== undefined) {
    if (typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { error: `El campo "enabled" debe ser booleano` },
        { status: 400 }
      );
    }
    data.enabled = body.enabled;
  }

  if (body.role !== undefined) {
    if (typeof body.role !== "string" || !ROLES_VALIDOS.includes(body.role)) {
      return NextResponse.json(
        { error: `El campo "role" no es válido` },
        { status: 400 }
      );
    }
    data.role = body.role;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Envía enabled o role" },
      { status: 400 }
    );
  }

  const existe = await prisma.user.findUnique({
    where: { id: parsed },
    select: { id: true },
  });
  if (!existe) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const user = await prisma.user.update({ where: { id: parsed }, data });
  return NextResponse.json(user);
}

export async function DELETE(_request, { params }) {
  const admin = await requiereAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = parseId(id);
  if (parsed === null) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }

  const existe = await prisma.user.findUnique({
    where: { id: parsed },
    select: { id: true },
  });
  if (!existe) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: parsed } });
  return NextResponse.json({ ok: true });
}