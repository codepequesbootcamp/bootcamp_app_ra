import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { error: "Email o contraseña incorrectos" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("session", String(user.id));

  return NextResponse.json({ ok: true });
}