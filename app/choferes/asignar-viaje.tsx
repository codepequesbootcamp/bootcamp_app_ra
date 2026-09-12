"use client";

import { useState } from "react";

type AsignarViajeProps = {
  id: number;
  viajando: boolean;
  onChange?: (viajando: boolean) => void;
};

export default function AsignarViaje({
  id,
  viajando,
  onChange,
}: AsignarViajeProps) {
  const [estado, setEstado] = useState(viajando);
  const [cargando, setCargando] = useState(false);

  async function toggle() {
    setCargando(true);
    try {
      const res = await fetch(`/api/choferes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viajando: !estado }),
      });
      if (res.ok) {
        setEstado(!estado);
        onChange?.(!estado);
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="asignar">
      <span className={estado ? "chip chip-on" : "chip chip-off"}>
        {estado ? "Viajando" : "No tiene viaje asignado"}
      </span>
      <button
        type="button"
        className="asignar-btn"
        onClick={toggle}
        disabled={cargando}
      >
        {estado ? "Finalizar viaje" : "Asignar viaje"}
      </button>
    </div>
  );
}