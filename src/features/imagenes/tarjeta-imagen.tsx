"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { DialogoConfirmacion } from "@/components/admin/dialogo-confirmacion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ImagenProductoListado } from "@/domain/imagenes";
import {
  accionActualizarImagen,
  accionDefinirImagenPrincipal,
  accionEliminarImagen,
  type EstadoAccionImagen,
  type EstadoFormularioImagen,
} from "@/features/imagenes/acciones";

const estadoFormularioInicial: EstadoFormularioImagen = {};
const estadoAccionInicial: EstadoAccionImagen = {};

interface TarjetaImagenProps extends ImagenProductoListado {
  productoId: string;
}

export function TarjetaImagen({
  productoId,
  id,
  rutaImagen,
  textoAlternativo,
  orden,
  esPrincipal,
}: TarjetaImagenProps) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [estadoEditar, accionEditar, editando] = useActionState(
    accionActualizarImagen.bind(null, productoId, id),
    estadoFormularioInicial,
  );
  const [estadoPrincipal, accionPrincipal, definiendoPrincipal] =
    useActionState(
      accionDefinirImagenPrincipal.bind(null, productoId, id),
      estadoAccionInicial,
    );
  const [estadoEliminar, accionEliminar, eliminando] = useActionState(
    accionEliminarImagen.bind(null, productoId, id),
    estadoAccionInicial,
  );

  return (
    <article className="overflow-hidden rounded-sm border border-border bg-surface shadow-card">
      <div className="relative aspect-square bg-background-secondary">
        <Image
          src={rutaImagen}
          alt={textoAlternativo}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-contain"
        />
        {esPrincipal ? (
          <Badge variant="accent" className="absolute left-3 top-3">
            Principal
          </Badge>
        ) : null}
      </div>

      <div className="p-4">
        <form action={accionEditar} className="grid gap-4" noValidate>
          <Input
            id={`textoAlternativo-${id}`}
            name="textoAlternativo"
            label="Texto alternativo"
            defaultValue={textoAlternativo}
            error={estadoEditar.errores?.textoAlternativo}
            maxLength={240}
            required
          />
          <Input
            id={`orden-${id}`}
            name="orden"
            type="number"
            label="Orden"
            defaultValue={orden}
            error={estadoEditar.errores?.orden}
            min={0}
            max={999999}
            step={1}
            required
          />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={editando}
          >
            {editando ? "Guardando…" : "Guardar datos"}
          </Button>
          {estadoEditar.mensaje ? (
            <p role="status" className="text-sm text-foreground-secondary">
              {estadoEditar.mensaje}
            </p>
          ) : null}
        </form>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {!esPrincipal ? (
            <form action={accionPrincipal}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                disabled={definiendoPrincipal}
              >
                {definiendoPrincipal ? "Guardando…" : "Definir principal"}
              </Button>
            </form>
          ) : null}
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDialogoAbierto(true)}
          >
            Eliminar
          </Button>
          {estadoPrincipal.mensaje && !estadoPrincipal.exito ? (
            <p role="alert" className="w-full text-sm text-error-light">
              {estadoPrincipal.mensaje}
            </p>
          ) : null}
        </div>
      </div>

      <form
        action={accionEliminar}
        className="hidden"
        id={`eliminar-imagen-${id}`}
      />
      <DialogoConfirmacion
        abierto={dialogoAbierto && !estadoEliminar.exito}
        titulo="¿Eliminar esta imagen?"
        descripcion={`Se quitará de forma permanente la imagen con texto alternativo “${textoAlternativo}”. Si es la principal, la siguiente imagen pasará a ocupar su lugar.`}
        procesando={eliminando}
        mensajeError={estadoEliminar.exito ? undefined : estadoEliminar.mensaje}
        alCancelar={() => setDialogoAbierto(false)}
        alConfirmar={() => {
          const formulario = document.getElementById(
            `eliminar-imagen-${id}`,
          ) as HTMLFormElement | null;
          formulario?.requestSubmit();
        }}
      />
    </article>
  );
}
