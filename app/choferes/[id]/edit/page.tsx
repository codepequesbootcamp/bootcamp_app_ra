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
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    fetch(`/api/choferes/${id}`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("cargar");
        return res.json();
      })
      .then((data: Chofer | null) => {
        if (cancelado) return;
        if (data === null) {
          setError("Chofer no encontrado.");
          return;
        }
        setChofer(data);
      })
      .catch(() => {
        if (!cancelado) setError("No se pudo cargar el chofer.");
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
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
    } else {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error || "No se pudieron guardar los cambios.");
    }
  }

  if (error && !chofer) {
    return (
      <main className="page">
        <p className="back">
          <Link href="/choferes">← Lista</Link>
        </p>
        <p className="notice">{error}</p>
      </main>
    );
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
      {error && <p className="notice">{error}</p>}
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