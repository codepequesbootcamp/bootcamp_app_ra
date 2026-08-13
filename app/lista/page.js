import Link from "next/link";

const choferes = [
  { id: 1, nombre: "Carlos Mendoza", licencia: "C-10234" },
  { id: 2, nombre: "María González", licencia: "C-20891" },
  { id: 3, nombre: "José Ramírez", licencia: "C-31567" },
  { id: 4, nombre: "Ana Torres", licencia: "C-44902" },
];

function iniciales(nombre) {
  return nombre
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ListaPage() {
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
      <ul className="list">
        {choferes.map((chofer) => (
          <li key={chofer.id}>
            <div className="avatar" aria-hidden="true">
              {iniciales(chofer.nombre)}
            </div>
            <div className="list-body">
              <strong>{chofer.nombre}</strong>
              <div className="meta">Licencia: {chofer.licencia}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
