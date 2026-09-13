"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";

function sessionActive() {
  return /(^|;\s*)session=/.test(document.cookie) ? "on" : "off";
}

const sessionStore = {
  value: typeof window === "undefined" ? "off" : sessionActive(),
  listeners: new Set<() => void>(),
};

function subscribe(listener: () => void) {
  function marcar() {
    sessionStore.value = sessionActive();
    listener();
  }
  window.addEventListener("sessionchange", marcar);
  window.addEventListener("storage", marcar);
  return () => {
    window.removeEventListener("sessionchange", marcar);
    window.removeEventListener("storage", marcar);
  };
}

function getSnapshot() {
  return sessionStore.value;
}

function getServerSnapshot() {
  return "off";
}

export default function SessionControls() {
  const pathname = usePathname();
  const sesion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (sesion === "off") return null;
  if (pathname === "/login" || pathname === "/register") return null;

  return <LogoutButton />;
}