"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Chofer = {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
};

export default function EditarChoferPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [chofer, setChofer] = useState<Chofer | null>(null);

  useEffect(() => {
    fetch(`/api/choferes/${id}`)
      .then((res) => res.json())
      .then((data) => setChofer(data));
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/choferes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: formData.get("nombre"),
        apellido: formData.get("apellido"),
        documento: formData.get("documento"),
        telefono: formData.get("telefono"),
      }),
    });

    if (res.ok) {
      router.push("/choferes");
    }
  }

  if (!chofer) {
    return (
      <main className="page">
        <p className="lede">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="back">
        <Link href="/choferes">← Lista</Link>
      </p>
      <header className="page-header">
        <p className="eyebrow">Edición</p>
        <h1>Editar chofer</h1>
        <p className="lede">Actualiza los datos del chofer</p>
      </header>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input type="text" name="nombre" defaultValue={chofer.nombre} required />
        </label>
        <label>
          Apellido
          <input
            type="text"
            name="apellido"
            defaultValue={chofer.apellido}
            required
          />
        </label>
        <label>
          Documento de identidad
          <input
            type="text"
            name="documento"
            defaultValue={chofer.documento}
            required
          />
        </label>
        <label>
          Teléfono
          <input
            type="tel"
            name="telefono"
            defaultValue={chofer.telefono}
            required
          />
        </label>
        <button type="submit">Guardar cambios</button>
      </form>
    </main>
  );
}
