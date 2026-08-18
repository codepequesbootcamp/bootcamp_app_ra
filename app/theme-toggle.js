"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [tema, setTema] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("tema") || "light";
    setTema(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function toggle() {
    const next = tema === "light" ? "dark" : "light";
    setTema(next);
    localStorage.setItem("tema", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle}>
      {tema === "light" ? "Tema oscuro" : "Tema claro"}
    </button>
  );
}
