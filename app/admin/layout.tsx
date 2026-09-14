import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) redirect("/");

  const id = Number(session);
  if (!Number.isInteger(id)) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true, enabled: true },
  });

  if (!user || !user.enabled || (user.role !== "admin" && user.role !== "super_admin")) {
    redirect("/");
  }

  return <>{children}</>;
}