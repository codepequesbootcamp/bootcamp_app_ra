"use client";

import { useState } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      window.dispatchEvent(new Event("sessionchange"));
      router.push("/choferes");
    } else {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error || "No se pudo iniciar sesión.");
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Acceso</p>
        <h1>Iniciar sesión</h1>
        <p className="lede">Ingresa con tu email y contraseña</p>
      </header>
      {error && <p className="notice">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" placeholder="tucorreo@ejemplo.com" required />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" placeholder="••••••••" required />
        </label>
        <button type="submit">Entrar</button>
      </form>
      <p className="back">
        <Link href="/register">← Crear una cuenta</Link>
      </p>
    </main>
  );
}