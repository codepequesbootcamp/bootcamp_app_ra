import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "bootcamp_app_ra",
  description: "Gestión de choferes",
};

export default function Home() {
  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">RAFAEL</p>
        <h1>CHOFERES</h1>
        <p className="lede">Gestión de choferes</p>
      </header>
      <nav className="links">
        <Link href="/choferes" className="card-link">
          <div>
            <strong>Lista de choferes</strong>
            <span>Consulta el personal registrado</span>
          </div>
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/choferes/new" className="card-link">
          <div>
            <strong>Nuevo chofer</strong>
            <span>Registrar un conductor</span>
          </div>
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </nav>
    </main>
  );
}