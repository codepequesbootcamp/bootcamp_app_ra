"use client";

import { useEffect, useSyncExternalStore } from "react";

const themeStore = {
  value:
    typeof window === "undefined"
      ? "light"
      : localStorage.getItem("tema") || "light",
  listeners: new Set<() => void>(),
};

function subscribe(listener: () => void) {
  themeStore.listeners.add(listener);
  return () => themeStore.listeners.delete(listener);
}

function getSnapshot() {
  return themeStore.value;
}

function getServerSnapshot() {
  return "light";
}

function toggle() {
  const next = themeStore.value === "light" ? "dark" : "light";
  themeStore.value = next;
  localStorage.setItem("tema", next);
  themeStore.listeners.forEach((l) => l());
}

export default function ThemeToggle() {
  const tema = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  function clickToggle() {
    toggle();
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={clickToggle}
      aria-label={
        tema === "light" ? "Cambiar a tema oscuro" : "Cambiar a tema claro"
      }
      title={tema === "light" ? "Tema oscuro" : "Tema claro"}
    >
      {tema === "light" ? (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}