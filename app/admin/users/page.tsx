"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type UserRow = {
  id: number;
  email: string;
  role: string;
  enabled: boolean;
};

const ROLES = ["client", "admin", "super_admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [listo, setListo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("cargar");
        return res.json();
      })
      .then((data: UserRow[]) => {
        if (!cancelado) {
          setUsers(data);
          setListo(true);
        }
      })
      .catch(() => {
        if (!cancelado) setError("No se pudieron cargar los usuarios.");
      });

    return () => {
      cancelado = true;
    };
  }, []);

  async function toggleEnabled(id: number, enabled: boolean) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    if (res.ok) {
      setUsers((actual) =>
        actual.map((user) =>
          user.id === id ? { ...user, enabled: !enabled } : user
        )
      );
    }
  }

  async function cambiarRol(id: number, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((actual) =>
        actual.map((user) => (user.id === id ? { ...user, role } : user))
      );
    }
  }

  async function eliminar(id: number) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((actual) => actual.filter((user) => user.id !== id));
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-16">
      <p className="mb-6">
        <Link href="/" className="text-sm font-semibold text-[var(--primary)] no-underline hover:underline">
          ← Inicio
        </Link>
      </p>
      <header className="mb-8">
        <p className="mb-3 inline-block rounded border border-[var(--border)] bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--primary-dark)]">
          Administración
        </p>
        <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-[var(--ink)]">Usuarios</h1>
        <p className="text-[var(--muted)]">Lista de usuarios registrados</p>
      </header>

      {error ? (
        <p className="text-[var(--danger)]">{error}</p>
      ) : !listo ? (
        <p className="text-[var(--muted)]">Cargando...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-md">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
                <th className="px-4 py-3 font-semibold">Habilitado</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[var(--ink)]">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => cambiarRol(user.id, e.target.value)}
                      className="rounded border border-[var(--border)] bg-[var(--input)] px-2 py-1 text-xs font-semibold text-[var(--ink)] outline-none focus:border-[var(--primary)]"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        user.enabled
                          ? "inline-block rounded bg-[#e8f7ee] px-2 py-0.5 text-xs font-bold text-[#157a3a]"
                          : "inline-block rounded bg-[#ffedd5] px-2 py-0.5 text-xs font-bold text-[#c2410c]"
                      }
                    >
                      {user.enabled ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleEnabled(user.id, user.enabled)}
                        className="rounded border border-[var(--border)] bg-transparent px-2 py-1 text-xs font-bold text-[var(--primary)] hover:underline"
                      >
                        {user.enabled ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminar(user.id)}
                        className="rounded border border-[var(--border)] bg-transparent px-2 py-1 text-xs font-bold text-[var(--danger)] hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[var(--muted)]">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}