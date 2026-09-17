"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { IconoAdmin } from "@/components/admin/icono-admin";
import { cerrarSesion } from "@/features/autenticacion/acciones";
import {
  esRutaAdminActiva,
  seccionesNavegacionAdmin,
} from "@/features/admin/navegacion-admin";
import { cn } from "@/lib/cn";

interface NavegacionAdminProps {
  administrador: {
    nombre: string | null;
    correo: string;
  };
}

function MarcaAdmin() {
  return (
    <Link
      href="/admin"
      className="flex min-h-12 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      aria-label="Alcohol Rockería, ir al dashboard"
    >
      <Image
        src="/branding/alcohol-rockeria-logo.png"
        alt=""
        width={52}
        height={52}
        className="size-11 object-contain"
        priority
      />
      <span className="min-w-0 font-display text-lg font-bold uppercase leading-[0.9] tracking-[0.08em]">
        Alcohol
        <span className="block text-accent">Administración</span>
      </span>
    </Link>
  );
}

function EnlacesAdmin({ alNavegar }: { alNavegar?: () => void }) {
  const rutaActual = usePathname();

  return (
    <nav aria-label="Navegación administrativa" className="grid gap-1">
      {seccionesNavegacionAdmin.map((seccion) => {
        const activa = esRutaAdminActiva(rutaActual, seccion.href);

        return (
          <Link
            key={seccion.href}
            href={seccion.href}
            onClick={alNavegar}
            aria-current={activa ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-sm border border-transparent px-3 py-2 text-sm font-semibold text-foreground-secondary transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              activa &&
                "border-accent/35 bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent",
            )}
          >
            <IconoAdmin nombre={seccion.icono} className="size-5 shrink-0" />
            <span>{seccion.etiqueta}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function PerfilAdmin({
  administrador,
}: Pick<NavegacionAdminProps, "administrador">) {
  return (
    <div className="border-t border-border pt-4">
      <p className="truncate text-sm font-semibold text-foreground">
        {administrador.nombre ?? "Administrador"}
      </p>
      <p className="mt-1 truncate text-xs text-muted">{administrador.correo}</p>
      <form action={cerrarSesion} className="mt-3">
        <button
          type="submit"
          className="flex min-h-11 w-full items-center justify-center rounded-sm border border-border bg-surface px-4 text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

export function NavegacionAdmin({ administrador }: NavegacionAdminProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const idMenu = useId();
  const botonMenuRef = useRef<HTMLButtonElement>(null);
  const botonCerrarRef = useRef<HTMLButtonElement>(null);
  const dialogoMenuRef = useRef<HTMLDialogElement>(null);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  useEffect(() => {
    const dialogo = dialogoMenuRef.current;

    if (!dialogo) {
      return;
    }

    if (!menuAbierto) {
      if (dialogo.open) {
        dialogo.close();
        botonMenuRef.current?.focus();
      }

      return;
    }

    if (!dialogo.open) {
      dialogo.showModal();
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    botonCerrarRef.current?.focus();

    function manejarTeclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        cerrarMenu();
      }
    }

    window.addEventListener("keydown", manejarTeclado);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", manejarTeclado);
    };
  }, [menuAbierto]);

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md lg:hidden">
        <MarcaAdmin />
        <button
          ref={botonMenuRef}
          type="button"
          onClick={() => setMenuAbierto(true)}
          aria-expanded={menuAbierto}
          aria-controls={idMenu}
          aria-label="Abrir menú administrativo"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      <aside className="hidden h-svh w-72 shrink-0 flex-col border-r border-border bg-background px-4 py-5 lg:sticky lg:top-0 lg:flex">
        <MarcaAdmin />
        <div className="my-5 h-px bg-border" />
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <EnlacesAdmin />
        </div>
        <PerfilAdmin administrador={administrador} />
      </aside>

      <dialog
        ref={dialogoMenuRef}
        id={idMenu}
        onCancel={(evento) => {
          evento.preventDefault();
          cerrarMenu();
        }}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) cerrarMenu();
        }}
        aria-label="Menú administrativo"
        className="fixed inset-0 z-50 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm lg:hidden"
      >
        <aside className="flex h-full w-[min(21rem,88vw)] flex-col border-r border-border bg-background p-4 text-foreground shadow-elevated">
          <div className="flex items-center justify-between gap-3">
            <MarcaAdmin />
            <button
              ref={botonCerrarRef}
              type="button"
              onClick={cerrarMenu}
              aria-label="Cerrar menú administrativo"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="my-5 h-px bg-border" />
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <EnlacesAdmin alNavegar={cerrarMenu} />
          </div>
          <PerfilAdmin administrador={administrador} />
        </aside>
      </dialog>
    </>
  );
}
