import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: { id: true, email: true, role: true, enabled: true },
  });
  return NextResponse.json(users);
}