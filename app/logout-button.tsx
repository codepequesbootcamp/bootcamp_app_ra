"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function cerrarSesion() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("sessionchange"));
    router.push("/login");
  }

  return (
    <button type="button" className="logout-toggle" onClick={cerrarSesion}>
      Cerrar sesión
    </button>
  );
}