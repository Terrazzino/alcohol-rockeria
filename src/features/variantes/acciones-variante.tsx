"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { DialogoConfirmacion } from "@/components/admin/dialogo-confirmacion";
import { Button, buttonStyles } from "@/components/ui/button";
import {
  accionCambiarDisponibilidadVariante,
  accionEliminarVariante,
  type EstadoAccionVariante,
} from "@/features/variantes/acciones";

interface AccionesVarianteProps {
  productoId: string;
  id: string;
  nombre: string;
  estaDisponible: boolean;
}

const estadoInicial: EstadoAccionVariante = {};

export function AccionesVariante({
  productoId,
  id,
  nombre,
  estaDisponible,
}: AccionesVarianteProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [estadoDisponibilidad, accionDisponibilidad, cambiandoDisponibilidad] =
    useActionState(
      accionCambiarDisponibilidadVariante.bind(
        null,
        productoId,
        id,
        !estaDisponible,
      ),
      estadoInicial,
    );
  const [estadoEliminar, accionEliminar, eliminando] = useActionState(
    accionEliminarVariante.bind(null, productoId, id),
    estadoInicial,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/productos/${productoId}/variantes/${id}/editar`}
        className={buttonStyles({ variant: "secondary", size: "sm" })}
      >
        Editar
      </Link>
      <form action={accionDisponibilidad}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={cambiandoDisponibilidad}
          aria-label={`${estaDisponible ? "Marcar como no disponible" : "Marcar como disponible"} ${nombre}`}
        >
          {cambiandoDisponibilidad
            ? "Guardando…"
            : estaDisponible
              ? "Desactivar"
              : "Activar"}
        </Button>
      </form>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setDialogoAbierto(true)}
      >
        Eliminar
      </Button>
      {estadoDisponibilidad.mensaje && !estadoDisponibilidad.exito ? (
        <p role="alert" className="w-full text-sm text-error-light">
          {estadoDisponibilidad.mensaje}
        </p>
      ) : null}
      <form action={accionEliminar} className="hidden" id={`eliminar-${id}`} />
      <DialogoConfirmacion
        abierto={dialogoAbierto && !estadoEliminar.exito}
        titulo={`¿Eliminar la variante “${nombre}”?`}
        descripcion="Esta acción elimina únicamente esta variante. El producto y sus demás variantes no se modificarán."
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
