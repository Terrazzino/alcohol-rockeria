"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ContenedorFormularioAdmin } from "@/components/admin/contenedor-formulario-admin";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatearPrecioArgentino } from "@/domain/productos";
import type {
  ProductoConVariantes,
  VarianteEditable,
} from "@/domain/variantes";
import {
  accionActualizarVariante,
  accionCrearVariante,
  type EstadoFormularioVariante,
} from "@/features/variantes/acciones";

interface FormularioVarianteProps {
  producto: ProductoConVariantes;
  variante?: VarianteEditable;
}

const estadoInicial: EstadoFormularioVariante = {};

export function FormularioVariante({
  producto,
  variante,
}: FormularioVarianteProps) {
  const accion = variante
    ? accionActualizarVariante.bind(null, producto.id, variante.id)
    : accionCrearVariante.bind(null, producto.id);
  const [estado, ejecutarAccion, pendiente] = useActionState(
    accion,
    estadoInicial,
  );
  const rutaListado = `/admin/productos/${producto.id}/variantes`;

  return (
    <form action={ejecutarAccion} noValidate>
      <ContenedorFormularioAdmin
        titulo={variante ? "Editar variante" : "Nueva variante"}
        descripcion={`Producto: ${producto.nombre}. Precio base: ${formatearPrecioArgentino(producto.precioBase)}.`}
        acciones={
          <>
            <Link
              href={rutaListado}
              className={buttonStyles({ variant: "secondary" })}
            >
              Cancelar
            </Link>
            <Button type="submit" disabled={pendiente}>
              {pendiente ? "Guardando…" : "Guardar variante"}
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
            defaultValue={variante?.nombre ?? ""}
            error={estado.errores?.nombre}
            placeholder="Ejemplo: Talle XL"
            maxLength={100}
            required
          />
          <Input
            id="sku"
            name="sku"
            label="SKU (opcional)"
            defaultValue={variante?.sku ?? ""}
            error={estado.errores?.sku}
            hint="Debe ser único. Usá letras, números y separadores simples."
            placeholder="REM-XL-001"
            maxLength={64}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:items-end">
          <Input
            id="precioEspecifico"
            name="precioEspecifico"
            type="text"
            inputMode="decimal"
            label="Precio específico (opcional)"
            defaultValue={variante?.precioEspecifico ?? ""}
            error={estado.errores?.precioEspecifico}
            hint="Vacío usa el precio base. Acepta punto o coma decimal."
            placeholder="28000"
          />
          <Input
            id="orden"
            name="orden"
            type="number"
            label="Orden"
            defaultValue={variante?.orden ?? 0}
            error={estado.errores?.orden}
            hint="Los números menores aparecen primero."
            min={0}
            max={999999}
            step={1}
            required
          />
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-border bg-background-secondary px-4 py-3 text-sm font-semibold text-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
          <input
            type="checkbox"
            name="estaDisponible"
            defaultChecked={variante?.estaDisponible ?? true}
            className="size-5 accent-accent"
          />
          Variante disponible
        </label>
      </ContenedorFormularioAdmin>
    </form>
  );
}
