"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function NuevoChoferPage() {
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/choferes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: formData.get("nombre"),
        apellido: formData.get("apellido"),
        documento: formData.get("documento"),
        telefono: formData.get("telefono"),
      }),
    });

    if (res.ok) {
      setMensaje("Guardado");
      form.reset();
    }
  }

  return (
    <main className="page">
      <p className="back">
        <Link href="/">← Inicio</Link>
      </p>
      <header className="page-header">
        <p className="eyebrow">Registro</p>
        <h1>Nuevo chofer</h1>
        <p className="lede">Completa el formulario para agregar un chofer</p>
      </header>
      {mensaje && <p className="notice">{mensaje}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input type="text" name="nombre" placeholder="Ej. Pedro" required />
        </label>
        <label>
          Apellido
          <input type="text" name="apellido" placeholder="Ej. López" required />
        </label>
        <label>
          Documento de identidad
          <input
            type="text"
            name="documento"
            placeholder="Ej. V-12345678"
            required
          />
        </label>
        <label>
          Teléfono
          <input
            type="tel"
            name="telefono"
            placeholder="Ej. 0412-1234567"
            required
          />
        </label>
        <button type="submit">Guardar chofer</button>
      </form>
    </main>
  );
}
