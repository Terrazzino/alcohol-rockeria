"use client";

import { useActionState } from "react";

import { ContenedorFormularioAdmin } from "@/components/admin/contenedor-formulario-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ConfiguracionTiendaEditable } from "@/domain/configuracion-tienda";
import {
  accionGuardarConfiguracion,
  type EstadoFormularioConfiguracion,
} from "@/features/configuracion/acciones";

const estadoInicial: EstadoFormularioConfiguracion = {};

function TituloSeccion({
  id,
  titulo,
  descripcion,
}: {
  id: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="border-b border-border pb-3">
      <h3
        id={id}
        className="font-display text-xl font-bold uppercase tracking-wide"
      >
        {titulo}
      </h3>
      <p className="mt-1 text-sm leading-6 text-foreground-secondary">
        {descripcion}
      </p>
    </div>
  );
}

export function FormularioConfiguracion({
  configuracion,
}: {
  configuracion: ConfiguracionTiendaEditable | null;
}) {
  const [estado, accion, pendiente] = useActionState(
    accionGuardarConfiguracion,
    estadoInicial,
  );

  return (
    <form action={accion} noValidate>
      <ContenedorFormularioAdmin
        titulo="Datos del comercio"
        descripcion="Estos valores quedarán preparados para su uso público en fases posteriores. En esta fase sólo se administran y persisten."
        acciones={
          <Button type="submit" disabled={pendiente}>
            {pendiente ? "Guardando…" : "Guardar configuración"}
          </Button>
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

        <section className="grid gap-5" aria-labelledby="config-identidad">
          <TituloSeccion
            id="config-identidad"
            titulo="Identidad y hero"
            descripcion="Nombre y mensajes principales configurables del comercio."
          />
          <Input
            id="nombreTienda"
            name="nombreTienda"
            label="Nombre del comercio"
            defaultValue={configuracion?.nombreTienda ?? ""}
            error={estado.errores?.nombreTienda}
            maxLength={100}
            autoComplete="organization"
            required
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="tituloPrincipal"
              name="tituloPrincipal"
              label="Título principal"
              defaultValue={configuracion?.tituloPrincipal ?? ""}
              error={estado.errores?.tituloPrincipal}
              hint="Mensaje principal del hero."
              maxLength={160}
              required
            />
            <Input
              id="subtituloPrincipal"
              name="subtituloPrincipal"
              label="Subtítulo principal"
              defaultValue={configuracion?.subtituloPrincipal ?? ""}
              error={estado.errores?.subtituloPrincipal}
              hint="Texto complementario del hero."
              maxLength={300}
              required
            />
          </div>
        </section>

        <section className="grid gap-5" aria-labelledby="config-contacto">
          <TituloSeccion
            id="config-contacto"
            titulo="Contacto y ubicación"
            descripcion="Canales, dirección y horarios oficiales del local."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="numeroWhatsapp"
              name="numeroWhatsapp"
              type="tel"
              inputMode="tel"
              label="Número de WhatsApp"
              defaultValue={configuracion?.numeroWhatsapp ?? ""}
              error={estado.errores?.numeroWhatsapp}
              hint="Incluí el código de país. Se guardarán solamente los dígitos."
              placeholder="+54 9 341 555-1234"
              autoComplete="tel"
              required
            />
            <Input
              id="urlInstagram"
              name="urlInstagram"
              type="url"
              label="URL de Instagram"
              defaultValue={configuracion?.urlInstagram ?? ""}
              error={estado.errores?.urlInstagram}
              placeholder="https://www.instagram.com/alcoholrockeria/"
              maxLength={2048}
              autoComplete="url"
              required
            />
          </div>
          <Input
            id="direccion"
            name="direccion"
            label="Dirección"
            defaultValue={configuracion?.direccion ?? ""}
            error={estado.errores?.direccion}
            maxLength={300}
            autoComplete="street-address"
            required
          />
          <Input
            id="urlMaps"
            name="urlMaps"
            type="url"
            label="URL de Maps"
            defaultValue={configuracion?.urlMaps ?? ""}
            error={estado.errores?.urlMaps}
            hint="Enlace público a la ubicación del local."
            placeholder="https://maps.app.goo.gl/…"
            maxLength={2048}
            required
          />
          <Textarea
            id="horarios"
            name="horarios"
            label="Horarios"
            defaultValue={configuracion?.horarios ?? ""}
            error={estado.errores?.horarios}
            hint="Podés usar varias líneas para diferenciar los días."
            maxLength={1000}
            rows={4}
            required
          />
        </section>

        <section className="grid gap-5" aria-labelledby="config-textos">
          <TituloSeccion
            id="config-textos"
            titulo="Textos institucionales"
            descripcion="Historia del comercio y mensaje general de contacto."
          />
          <Textarea
            id="textoHistoria"
            name="textoHistoria"
            label="Historia"
            defaultValue={configuracion?.textoHistoria ?? ""}
            error={estado.errores?.textoHistoria}
            maxLength={5000}
            rows={8}
            required
          />
          <Textarea
            id="textoContacto"
            name="textoContacto"
            label="Texto de contacto"
            defaultValue={configuracion?.textoContacto ?? ""}
            error={estado.errores?.textoContacto}
            maxLength={2000}
            rows={5}
            required
          />
        </section>
      </ContenedorFormularioAdmin>
    </form>
  );
}
