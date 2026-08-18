"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AsignarViaje({ id, viajando }) {
  const router = useRouter();
  const [estado, setEstado] = useState(viajando);
  const [cargando, setCargando] = useState(false);

  async function toggle() {
    setCargando(true);
    const res = await fetch(`/api/choferes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viajando: !estado }),
    });
    if (res.ok) {
      setEstado(!estado);
      router.refresh();
    }
    setCargando(false);
  }

  return (
    <div className="asignar">
      <span className={estado ? "chip chip-on" : "chip"}>
        {estado ? "Viajando" : "No tiene viaje asignado"}
      </span>
      <button type="button" className="asignar-btn" onClick={toggle} disabled={cargando}>
        {estado ? "Finalizar viaje" : "Asignar viaje"}
      </button>
    </div>
  );
}
