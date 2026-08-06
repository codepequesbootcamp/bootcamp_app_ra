import Link from "next/link";

const choferes = [
  { id: 1, nombre: "Carlos Mendoza", licencia: "C-10234" },
  { id: 2, nombre: "María González", licencia: "C-20891" },
  { id: 3, nombre: "José Ramírez", licencia: "C-31567" },
  { id: 4, nombre: "Ana Torres", licencia: "C-44902" },
];

export default function ListaPage() {
  return (
    <main className="page">
      <p className="back">
        <Link href="/">← Inicio</Link>
      </p>
      <h1>Choferes</h1>
      <p>Lista de choferes registrados</p>
      <ul className="list">
        {choferes.map((chofer) => (
          <li key={chofer.id}>
            <strong>{chofer.nombre}</strong>
            <div style={{ color: "#555", marginTop: "0.25rem" }}>
              Licencia: {chofer.licencia}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
