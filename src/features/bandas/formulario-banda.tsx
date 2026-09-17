"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ContenedorFormularioAdmin } from "@/components/admin/contenedor-formulario-admin";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BandaEditable } from "@/domain/bandas";
import { generarSlug } from "@/domain/slug";
import {
  accionActualizarBanda,
  accionCrearBanda,
  type EstadoFormularioBanda,
} from "@/features/bandas/acciones";

interface FormularioBandaProps {
  banda?: BandaEditable;
}

const estadoInicial: EstadoFormularioBanda = {};

export function FormularioBanda({ banda }: FormularioBandaProps) {
  const accion = banda
    ? accionActualizarBanda.bind(null, banda.id)
    : accionCrearBanda;
  const [estado, ejecutarAccion, pendiente] = useActionState(
    accion,
    estadoInicial,
  );
  const [nombre, setNombre] = useState(banda?.nombre ?? "");
  const [slug, setSlug] = useState(banda?.slug ?? "");
  const [slugPersonalizado, setSlugPersonalizado] = useState(Boolean(banda));

  return (
    <form action={ejecutarAccion} noValidate>
      <ContenedorFormularioAdmin
        titulo={banda ? "Editar banda" : "Nueva banda"}
        descripcion="Definí cómo se identifica, ordena y muestra esta banda."
        acciones={
          <>
            <Link
              href="/admin/bandas"
              className={buttonStyles({ variant: "secondary" })}
            >
              Cancelar
            </Link>
            <Button type="submit" disabled={pendiente}>
              {pendiente ? "Guardando…" : "Guardar banda"}
            </Button>
          </>
        }
      >
        {estado.mensaje ? (
          <p
            role="alert"
            className="rounded-sm border border-error/40 bg-error-soft p-3 text-sm text-error-light"
          >
            {estado.mensaje}
          </p>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="nombre"
            name="nombre"
            label="Nombre"
            value={nombre}
            onChange={(evento) => {
              const nuevoNombre = evento.target.value;
              setNombre(nuevoNombre);
              if (!slugPersonalizado) setSlug(generarSlug(nuevoNombre));
            }}
            error={estado.errores?.nombre}
            autoComplete="off"
            maxLength={100}
            required
          />
          <Input
            id="slug"
            name="slug"
            label="Slug"
            value={slug}
            onChange={(evento) => {
              setSlug(evento.target.value);
              setSlugPersonalizado(true);
            }}
            error={estado.errores?.slug}
            hint="Se usa como identificador legible. Ejemplo: la-renga."
            autoComplete="off"
            maxLength={120}
            required
          />
        </div>

        <Textarea
          id="descripcion"
          name="descripcion"
          label="Descripción (opcional)"
          defaultValue={banda?.descripcion ?? ""}
          error={estado.errores?.descripcion}
          maxLength={1000}
        />

        <Input
          id="urlImagen"
          name="urlImagen"
          type="url"
          label="URL de imagen (opcional)"
          defaultValue={banda?.urlImagen ?? ""}
          error={estado.errores?.urlImagen}
          placeholder="https://…"
          maxLength={2048}
        />

        <div className="grid gap-5 md:grid-cols-2 md:items-end">
          <Input
            id="orden"
            name="orden"
            type="number"
            label="Orden"
            defaultValue={banda?.orden ?? 0}
            error={estado.errores?.orden}
            hint="Los números menores aparecen primero."
            min={0}
            max={999999}
            step={1}
            required
          />
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-border bg-background-secondary px-4 py-3 text-sm font-semibold text-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
            <input
              type="checkbox"
              name="estaVisible"
              defaultChecked={banda?.estaVisible ?? true}
              className="size-5 accent-accent"
            />
            Visible en el catálogo
          </label>
        </div>
      </ContenedorFormularioAdmin>
    </form>
  );
}
