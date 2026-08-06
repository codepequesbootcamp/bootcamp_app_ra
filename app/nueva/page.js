import Link from "next/link";

export default function NuevaPage() {
  return (
    <main className="page">
      <p className="back">
        <Link href="/">← Inicio</Link>
      </p>
      <h1>Nuevo chofer</h1>
      <p>Completa el formulario para agregar un chofer</p>
      <form className="form">
        <label>
          Nombre completo
          <input type="text" name="nombre" placeholder="Ej. Pedro López" />
        </label>
        <label>
          Número de licencia
          <input type="text" name="licencia" placeholder="Ej. C-50001" />
        </label>
        <label>
          Teléfono
          <input type="tel" name="telefono" placeholder="Ej. 0412-1234567" />
        </label>
        <button type="button">Guardar chofer</button>
      </form>
    </main>
  );
}
