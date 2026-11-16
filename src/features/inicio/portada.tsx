import Image from "next/image";

import { TarjetaProducto } from "@/components/tarjeta-producto";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import type { ProductoPublico } from "@/domain/catalogo-publico";
import type { ConfiguracionPublica } from "@/domain/inicio";
import { crearUrlWhatsappGeneral } from "@/domain/whatsapp";

export function HeroInicio({
  configuracion,
}: {
  configuracion: ConfiguracionPublica | null;
}) {
  return (
    <section
      id="inicio"
      className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden border-b border-border"
    >
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute inset-0 -z-10 bg-grain opacity-35" />
      <div
        aria-hidden="true"
        className="absolute -right-36 top-14 -z-10 size-80 rounded-full bg-accent/10 blur-3xl sm:right-0 sm:size-[30rem]"
      />
      <Container className="grid min-h-[calc(100svh-4.5rem)] items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-18">
        <div className="min-w-0 max-w-3xl">
          <Badge variant="accent">Catálogo público</Badge>
          <h1 className="mt-6 break-words font-display text-[clamp(2.75rem,13vw,7rem)] font-bold uppercase leading-[0.88] tracking-[-0.025em] text-foreground">
            {configuracion?.nombreTienda ?? "Información por configurar"}
          </h1>
          {configuracion ? (
            <>
              <p className="mt-6 max-w-2xl font-display text-2xl font-bold uppercase leading-tight tracking-wide text-accent sm:text-3xl">
                {configuracion.tituloPrincipal}
              </p>
              <p className="mt-4 max-w-xl text-base font-medium leading-7 text-foreground-secondary sm:text-lg sm:leading-8">
                {configuracion.subtituloPrincipal}
              </p>
            </>
          ) : (
            <p className="mt-6 max-w-xl text-base leading-7 text-foreground-secondary">
              Los datos principales del comercio todavía no están disponibles.
              El catálogo puede explorarse normalmente.
            </p>
          )}
          <div className="mt-8 flex max-w-full flex-col gap-3 sm:flex-row">
            <a
              href="#productos"
              className={buttonStyles({
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Explorar productos <span aria-hidden="true">↓</span>
            </a>
            <a
              href="#categorias"
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Ver categorías
            </a>
          </div>
        </div>
        <div className="relative mx-auto min-w-0 w-full max-w-xs sm:max-w-sm lg:max-w-lg">
          <div className="absolute inset-12 rounded-full bg-accent/12 blur-3xl" />
          <Image
            src="/branding/alcohol-rockeria-logo.png"
            alt={
              configuracion
                ? `Logo de ${configuracion.nombreTienda}`
                : "Logo del comercio"
            }
            width={640}
            height={640}
            className="relative h-auto w-full object-contain drop-shadow-[0_24px_60px_rgba(242,196,0,0.14)]"
            priority
          />
        </div>
      </Container>
    </section>
  );
}

export function ProductosDestacadosInicio({
  productos,
}: {
  productos: ProductoPublico[];
}) {
  return (
    <Section
      id="destacados"
      className="border-y border-border bg-background-secondary"
      eyebrow="Selección del local"
      title="Productos destacados"
      description="Una selección administrada entre los productos publicados actualmente."
      action={
        <a
          href="#productos"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          Ver catálogo completo
        </a>
      }
    >
      {productos.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hay productos destacados"
          description="Los productos marcados como destacados aparecerán aquí cuando estén publicados."
          action={
            <a href="#productos" className={buttonStyles()}>
              Explorar catálogo
            </a>
          }
        />
      )}
    </Section>
  );
}

export function TrayectoriaInicio({
  configuracion,
}: {
  configuracion: ConfiguracionPublica | null;
}) {
  return (
    <Section
      id="historia"
      eyebrow="Trayectoria"
      title="Nuestra historia"
      className="relative overflow-hidden"
      contentClassName="relative"
    >
      <div className="absolute inset-0 -z-10 bg-grain opacity-20" />
      {configuracion ? (
        <div className="grid gap-6 border-l-4 border-accent pl-5 sm:pl-8 lg:grid-cols-[0.6fr_1.4fr] lg:items-start">
          <p className="font-display text-4xl font-bold uppercase leading-none tracking-wide text-accent sm:text-5xl">
            {configuracion.tituloPrincipal}
          </p>
          <p className="whitespace-pre-line text-base leading-8 text-foreground-secondary sm:text-lg">
            {configuracion.textoHistoria}
          </p>
        </div>
      ) : (
        <EmptyState
          title="Historia por configurar"
          description="La trayectoria del comercio aparecerá cuando se cargue su configuración pública."
        />
      )}
    </Section>
  );
}

export function InformacionLocalInicio({
  configuracion,
}: {
  configuracion: ConfiguracionPublica | null;
}) {
  return (
    <Section
      id="local"
      className="border-y border-border bg-background-secondary"
      eyebrow="El local"
      title="Información para visitarnos"
    >
      {configuracion ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent>
              <p className="eyebrow">Dirección</p>
              <p className="mt-4 whitespace-pre-line text-lg font-semibold leading-7 text-foreground">
                {configuracion.direccion}
              </p>
              <a
                href={configuracion.urlMaps}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({
                  variant: "secondary",
                  size: "sm",
                  className: "mt-5 w-full sm:w-auto",
                })}
              >
                Abrir en Maps
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="eyebrow">Horarios</p>
              <p className="mt-4 whitespace-pre-line text-base leading-7 text-foreground-secondary">
                {configuracion.horarios}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="Información del local no disponible"
          description="La dirección y los horarios aparecerán cuando se complete la configuración del comercio."
        />
      )}
    </Section>
  );
}

export function ContactoInicio({
  configuracion,
}: {
  configuracion: ConfiguracionPublica | null;
}) {
  const urlWhatsapp = crearUrlWhatsappGeneral(
    configuracion?.numeroWhatsapp ?? null,
  );
  return (
    <Section
      id="contacto"
      eyebrow="Contacto"
      title="Hablemos"
      description={configuracion?.textoContacto}
    >
      {configuracion ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={configuracion.urlInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-28 items-center justify-between gap-4 rounded-sm border border-border bg-surface p-5 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span>
              <span className="eyebrow">Redes</span>
              <span className="mt-2 block font-display text-2xl font-bold uppercase tracking-wide group-hover:text-accent">
                Instagram
              </span>
            </span>
            <span aria-hidden="true" className="text-2xl text-accent">
              ↗
            </span>
          </a>
          {urlWhatsapp && (
            <a
              href={urlWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-28 items-center justify-between gap-4 rounded-sm border border-border bg-surface p-5 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span>
                <span className="eyebrow">Consultas</span>
                <span className="mt-2 block font-display text-2xl font-bold uppercase tracking-wide group-hover:text-accent">
                  WhatsApp
                </span>
              </span>
              <span aria-hidden="true" className="text-2xl text-accent">
                ↗
              </span>
            </a>
          )}
        </div>
      ) : (
        <EmptyState
          title="Canales de contacto por configurar"
          description="Instagram y WhatsApp aparecerán cuando el comercio complete su configuración."
        />
      )}
    </Section>
  );
}
