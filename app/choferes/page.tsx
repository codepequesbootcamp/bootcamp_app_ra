import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AsignarViaje from "./asignar-viaje";

export const dynamic = "force-dynamic";

export default async function ChoferesPage() {
  const choferes = await prisma.drivers.findMany({
    orderBy: { id: "desc" },
  });

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
      {choferes.length === 0 ? (
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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
