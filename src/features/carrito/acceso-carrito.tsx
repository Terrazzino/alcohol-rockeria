"use client";

import Link from "next/link";

import { useCarrito } from "./proveedor-carrito";

export function AccesoCarrito() {
  const { cantidadUnidades, hidratado } = useCarrito();
  const cantidad = hidratado ? cantidadUnidades : 0;

  return (
    <Link
      href="/carrito"
      className="relative inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-border bg-surface px-3 text-xs font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={`Carrito de consulta, ${cantidad} ${cantidad === 1 ? "unidad" : "unidades"}`}
    >
      <span aria-hidden="true">▣</span>
      <span className="hidden sm:inline">Carrito</span>
      <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-[0.6875rem] text-accent-foreground tabular-nums">
        {cantidad}
      </span>
    </Link>
  );
}
