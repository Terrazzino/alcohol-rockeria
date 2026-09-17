"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

interface DialogoConfirmacionProps {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  textoConfirmar?: string;
  procesando?: boolean;
  mensajeError?: string;
  alConfirmar: () => void;
  alCancelar: () => void;
}

export function DialogoConfirmacion({
  abierto,
  titulo,
  descripcion,
  textoConfirmar = "Eliminar",
  procesando = false,
  mensajeError,
  alConfirmar,
  alCancelar,
}: DialogoConfirmacionProps) {
  const referenciaDialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = referenciaDialogo.current;

    if (!dialogo) {
      return;
    }

    if (abierto && !dialogo.open) {
      dialogo.showModal();
    } else if (!abierto && dialogo.open) {
      dialogo.close();
    }
  }, [abierto]);

  return (
    <dialog
      ref={referenciaDialogo}
      onCancel={(evento) => {
        evento.preventDefault();
        if (!procesando) alCancelar();
      }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-[30rem] rounded-sm border border-border-strong bg-surface p-0 text-foreground shadow-elevated backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      aria-labelledby="titulo-dialogo-confirmacion"
      aria-describedby="descripcion-dialogo-confirmacion"
    >
      <div className="p-5 sm:p-6">
        <p className="eyebrow text-error-light">Acción destructiva</p>
        <h2
          id="titulo-dialogo-confirmacion"
          className="mt-3 font-display text-3xl font-bold uppercase leading-none tracking-wide"
        >
          {titulo}
        </h2>
        <p
          id="descripcion-dialogo-confirmacion"
          className="mt-4 text-sm leading-6 text-foreground-secondary"
        >
          {descripcion}
        </p>
        {mensajeError ? (
          <p
            role="alert"
            className="mt-4 rounded-sm border border-error/40 bg-error-soft p-3 text-sm text-error-light"
          >
            {mensajeError}
          </p>
        ) : null}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={alCancelar}
            disabled={procesando}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={alConfirmar} disabled={procesando}>
            {procesando ? "Procesando…" : textoConfirmar}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
