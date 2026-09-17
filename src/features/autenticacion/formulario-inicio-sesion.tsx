"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type EstadoInicioSesion,
  iniciarSesion,
} from "@/features/autenticacion/acciones";

const estadoInicial: EstadoInicioSesion = {};

export function FormularioInicioSesion() {
  const [estado, accion, pendiente] = useActionState(
    iniciarSesion,
    estadoInicial,
  );

  return (
    <form action={accion} className="mt-7 grid gap-5" noValidate>
      <Input
        id="correo"
        name="correo"
        type="email"
        label="Correo electrónico"
        autoComplete="email"
        inputMode="email"
        required
        autoFocus
        error={estado.errores?.correo}
        disabled={pendiente}
      />
      <Input
        id="contrasena"
        name="contrasena"
        type="password"
        label="Contraseña"
        autoComplete="current-password"
        required
        minLength={12}
        error={estado.errores?.contrasena}
        disabled={pendiente}
      />

      {estado.mensaje ? (
        <p
          className="rounded-sm border border-error/40 bg-error-soft px-4 py-3 text-sm text-error-light"
          role="alert"
          aria-live="polite"
        >
          {estado.mensaje}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={pendiente}
      >
        {pendiente ? "Iniciando sesión…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
