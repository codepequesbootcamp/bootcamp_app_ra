"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [tema, setTema] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("tema") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  function toggle() {
    const next = tema === "light" ? "dark" : "light";
    setTema(next);
    localStorage.setItem("tema", next);
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle}>
      {tema === "light" ? "Tema oscuro" : "Tema claro"}
    </button>
  );
}