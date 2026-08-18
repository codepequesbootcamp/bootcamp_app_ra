"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AsignarViaje from "./asignar-viaje";

type Chofer = {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  viajando: boolean;
};

export default function ChoferesPage() {
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    fetch("/api/choferes")
      .then((res) => res.json())
      .then((data) => {
        setChoferes(data);
        setListo(true);
      });
  }, []);

  async function eliminar(id: number) {
    const res = await fetch(`/api/choferes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setChoferes((actual) => actual.filter((chofer) => chofer.id !== id));
    }
  }

  return (
    <main className="page">
      <p className="back">
        <Link href="/">← Inicio</Link>
      </p>
      <header className="page-header">
        <p className="eyebrow">Directorio</p>
        <h1>Choferes</h1>
        <p className="lede">Lista de choferes registrados</p>
      </header>
      <p className="back">
        <Link href="/choferes/new">+ Nuevo chofer</Link>
      </p>
      {!listo ? (
        <p className="lede">Cargando...</p>
      ) : choferes.length === 0 ? (
        <p className="lede">No hay choferes registrados.</p>
      ) : (
        <ul className="list">
          {choferes.map((chofer) => (
            <li key={chofer.id}>
              <div className="avatar" aria-hidden="true">
                {`${chofer.nombre?.[0] || ""}${chofer.apellido?.[0] || ""}`.toUpperCase()}
              </div>
              <div className="list-body">
                <strong>
                  {chofer.nombre} {chofer.apellido}
                </strong>
                <div className="meta">
                  Doc: {chofer.documento} · Tel: {chofer.telefono}
                </div>
              </div>
              <AsignarViaje id={chofer.id} viajando={chofer.viajando} />
              <Link href={`/choferes/${chofer.id}/edit`} className="edit-link">
                Editar
              </Link>
              <button
                type="button"
                className="delete-link"
                onClick={() => eliminar(chofer.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
