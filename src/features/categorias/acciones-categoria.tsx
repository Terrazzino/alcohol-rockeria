"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { DialogoConfirmacion } from "@/components/admin/dialogo-confirmacion";
import { Button, buttonStyles } from "@/components/ui/button";
import {
  accionCambiarVisibilidadCategoria,
  accionEliminarCategoria,
  type EstadoAccionCategoria,
} from "@/features/categorias/acciones";

interface AccionesCategoriaProps {
  id: string;
  nombre: string;
  estaVisible: boolean;
  cantidadProductos: number;
}

const estadoInicial: EstadoAccionCategoria = {};

export function AccionesCategoria({
  id,
  nombre,
  estaVisible,
  cantidadProductos,
}: AccionesCategoriaProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [estadoVisibilidad, accionVisibilidad, cambiandoVisibilidad] =
    useActionState(
      accionCambiarVisibilidadCategoria.bind(null, id, !estaVisible),
      estadoInicial,
    );
  const [estadoEliminar, accionEliminar, eliminando] = useActionState(
    accionEliminarCategoria.bind(null, id),
    estadoInicial,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/categorias/${id}/editar`}
        className={buttonStyles({ variant: "secondary", size: "sm" })}
      >
        Editar
      </Link>
      <form action={accionVisibilidad}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={cambiandoVisibilidad}
          aria-label={`${estaVisible ? "Ocultar" : "Mostrar"} ${nombre}`}
        >
          {cambiandoVisibilidad
            ? "Guardando…"
            : estaVisible
              ? "Ocultar"
              : "Mostrar"}
        </Button>
      </form>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setDialogoAbierto(true)}
      >
        Eliminar
      </Button>
      {estadoVisibilidad.mensaje && !estadoVisibilidad.exito ? (
        <p role="alert" className="w-full text-sm text-error-light">
          {estadoVisibilidad.mensaje}
        </p>
      ) : null}
      <form action={accionEliminar} className="hidden" id={`eliminar-${id}`} />
      <DialogoConfirmacion
        abierto={dialogoAbierto && !estadoEliminar.exito}
        titulo={`Eliminar “${nombre}”`}
        descripcion={
          cantidadProductos > 0
            ? `Esta categoría tiene ${cantidadProductos} producto${cantidadProductos === 1 ? "" : "s"} asociado${cantidadProductos === 1 ? "" : "s"}. La base de datos impedirá eliminarla mientras existan esas relaciones.`
            : "Esta acción elimina la categoría de forma permanente y no se puede deshacer."
        }
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
