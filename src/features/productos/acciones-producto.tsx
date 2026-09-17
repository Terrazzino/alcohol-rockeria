"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { DialogoConfirmacion } from "@/components/admin/dialogo-confirmacion";
import { Button, buttonStyles } from "@/components/ui/button";
import {
  ESTADOS_PRODUCTO,
  ETIQUETAS_ESTADO_PRODUCTO,
  type EstadoProductoDominio,
} from "@/domain/productos";
import {
  accionCambiarDestacadoProducto,
  accionCambiarEstadoProducto,
  accionEliminarProducto,
  type EstadoAccionProducto,
} from "@/features/productos/acciones";

interface AccionesProductoProps {
  id: string;
  nombre: string;
  estado: EstadoProductoDominio;
  destacado: boolean;
  cantidadVariantes: number;
}

const estadoInicial: EstadoAccionProducto = {};

export function AccionesProducto({
  id,
  nombre,
  estado,
  destacado,
  cantidadVariantes,
}: AccionesProductoProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [estadoCambio, accionEstado, cambiandoEstado] = useActionState(
    accionCambiarEstadoProducto.bind(null, id),
    estadoInicial,
  );
  const [estadoDestacado, accionDestacado, cambiandoDestacado] = useActionState(
    accionCambiarDestacadoProducto.bind(null, id, !destacado),
    estadoInicial,
  );
  const [estadoEliminar, accionEliminar, eliminando] = useActionState(
    accionEliminarProducto.bind(null, id),
    estadoInicial,
  );
  const mensajeError =
    (!estadoCambio.exito && estadoCambio.mensaje) ||
    (!estadoDestacado.exito && estadoDestacado.mensaje);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/productos/${id}/editar`}
        className={buttonStyles({ variant: "secondary", size: "sm" })}
      >
        Editar
      </Link>
      <Link
        href={`/admin/productos/${id}/variantes`}
        className={buttonStyles({ variant: "secondary", size: "sm" })}
      >
        Variantes ({cantidadVariantes})
      </Link>
      <form action={accionEstado} className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor={`estado-${id}`}>
          Estado de {nombre}
        </label>
        <select
          id={`estado-${id}`}
          name="estado"
          defaultValue={estado}
          className="min-h-10 rounded-sm border border-border bg-background-secondary px-3 text-sm text-foreground focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          {ESTADOS_PRODUCTO.map((estadoProducto) => (
            <option key={estadoProducto} value={estadoProducto}>
              {ETIQUETAS_ESTADO_PRODUCTO[estadoProducto]}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={cambiandoEstado}
        >
          {cambiandoEstado ? "Guardando…" : "Cambiar estado"}
        </Button>
      </form>
      <form action={accionDestacado}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={cambiandoDestacado}
          aria-label={`${destacado ? "Desmarcar como destacado" : "Marcar como destacado"} ${nombre}`}
        >
          {cambiandoDestacado
            ? "Guardando…"
            : destacado
              ? "Quitar destacado"
              : "Destacar"}
        </Button>
      </form>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setDialogoAbierto(true)}
      >
        Eliminar
      </Button>
      {mensajeError ? (
        <p role="alert" className="w-full text-sm text-error-light">
          {mensajeError}
        </p>
      ) : null}
      <form action={accionEliminar} className="hidden" id={`eliminar-${id}`} />
      <DialogoConfirmacion
        abierto={dialogoAbierto && !estadoEliminar.exito}
        titulo={`¿Eliminar “${nombre}”?`}
        descripcion="Esta acción elimina el producto de forma permanente. Si tiene imágenes o variantes relacionadas, también se eliminarán según las reglas actuales de la base de datos."
        procesando={eliminando}
        mensajeError={estadoEliminar.exito ? undefined : estadoEliminar.mensaje}
        alCancelar={() => setDialogoAbierto(false)}
        alConfirmar={() => {
          const formulario = document.getElementById(
            `eliminar-${id}`,
          ) as HTMLFormElement | null;
          formulario?.requestSubmit();
        }}
      />
    </div>
  );
}
