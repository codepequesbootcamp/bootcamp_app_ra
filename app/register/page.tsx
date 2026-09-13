"use client";

import { useState } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error || "No se pudo registrar el usuario.");
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Registro</p>
        <h1>Crear cuenta</h1>
        <p className="lede">Regístrate con tu email y contraseña</p>
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
        <button type="submit">Registrarse</button>
      </form>
      <p className="back">
        <Link href="/login">← Iniciar sesión</Link>
      </p>
    </main>
  );
}