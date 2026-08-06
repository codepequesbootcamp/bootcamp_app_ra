import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <h1>bootcamp_app_ra</h1>
      <p>Gestión de choferes</p>
      <nav className="links">
        <Link href="/lista">Ver lista de choferes</Link>
        <Link href="/nueva">Agregar nuevo chofer</Link>
      </nav>
    </main>
  );
}
