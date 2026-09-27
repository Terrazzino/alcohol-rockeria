"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TAMANO_MAXIMO_IMAGEN_MB } from "@/domain/imagenes";
import {
  accionSubirImagen,
  type EstadoFormularioImagen,
} from "@/features/imagenes/acciones";

const estadoInicial: EstadoFormularioImagen = {};

export function FormularioSubidaImagen({ productoId }: { productoId: string }) {
  const [estado, accion, pendiente] = useActionState(
    accionSubirImagen.bind(null, productoId),
    estadoInicial,
  );
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <form
      action={accion}
      className="rounded-sm border border-border bg-surface p-4 shadow-card sm:p-5"
      noValidate
    >
      <div>
        <p className="eyebrow">Nueva imagen</p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide">
          Subir archivo
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground-secondary">
          JPEG, PNG, WebP o AVIF. Máximo {TAMANO_MAXIMO_IMAGEN_MB} MB.
        </p>
      </div>

      {estado.mensaje ? (
        <p
          role="alert"
          className="mt-4 rounded-sm border border-error/40 bg-error-soft p-3 text-sm text-error-light"
        >
          {estado.mensaje}
        </p>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div>
          <label
            htmlFor="archivo"
            className="block text-sm font-semibold text-foreground"
          >
            Archivo
          </label>
          <input
            id="archivo"
            name="archivo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            aria-invalid={Boolean(estado.errores?.archivo)}
            aria-describedby={
              estado.errores?.archivo ? "archivo-error" : "archivo-ayuda"
            }
            className="mt-2 block min-h-11 w-full cursor-pointer rounded-sm border border-border bg-background-secondary text-sm text-foreground file:mr-3 file:min-h-11 file:border-0 file:border-r file:border-border file:bg-surface-raised file:px-3 file:font-semibold file:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-accent"
            onChange={(evento) => {
              if (preview) URL.revokeObjectURL(preview);
              const archivo = evento.target.files?.[0];
              setPreview(archivo ? URL.createObjectURL(archivo) : null);
            }}
          />
          {estado.errores?.archivo ? (
            <p id="archivo-error" className="mt-2 text-sm text-error">
              {estado.errores.archivo}
            </p>
          ) : (
            <p id="archivo-ayuda" className="mt-2 text-sm text-muted">
              La validación se repite en el servidor antes de subir.
            </p>
          )}

          <div className="relative mt-4 aspect-square overflow-hidden rounded-sm border border-border bg-background-secondary">
            {preview ? (
              <Image
                src={preview}
                alt="Vista previa de la imagen seleccionada"
                fill
                unoptimized
                className="object-contain"
              />
            ) : (
              <div className="flex size-full items-center justify-center p-6 text-center text-sm text-muted">
                La vista previa aparecerá aquí.
              </div>
            )}
          </div>
        </div>

        <div className="grid content-start gap-5">
          <Input
            id="textoAlternativo"
            name="textoAlternativo"
            label="Texto alternativo"
            error={estado.errores?.textoAlternativo}
            hint="Describí lo que se ve para accesibilidad."
            placeholder="Ejemplo: Remera negra de frente"
            maxLength={240}
            required
          />
          <Input
            id="orden"
            name="orden"
            type="number"
            label="Orden"
            defaultValue={0}
            error={estado.errores?.orden}
            hint="Los números menores aparecen primero."
            min={0}
            max={999999}
            step={1}
            required
          />
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-border bg-background-secondary px-4 py-3 text-sm font-semibold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
            <input
              type="checkbox"
              name="esPrincipal"
              className="size-5 accent-accent"
            />
            Usar como imagen principal
          </label>
          <Button
            type="submit"
            disabled={pendiente}
            className="sm:justify-self-start"
          >
            {pendiente ? "Subiendo…" : "Subir imagen"}
          </Button>
        </div>
      </div>
    </form>
  );
}
