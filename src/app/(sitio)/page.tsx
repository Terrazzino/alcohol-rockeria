import Image from "next/image";

import { TarjetaProducto } from "@/components/tarjeta-producto";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  bandasDemostracion,
  categoriasDemostracion,
  productosDemostracion,
} from "@/features/inicio/contenido-demostracion";

export default function PaginaInicio() {
  return (
    <main id="contenido-principal" className="flex-1">
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
        <p
          aria-hidden="true"
          className="display-outline absolute -bottom-7 left-1/2 -z-10 -translate-x-1/2 whitespace-nowrap font-display text-[8rem] font-bold uppercase leading-none opacity-25 sm:text-[13rem] lg:text-[20rem]"
        >
          1990
        </p>

        <Container className="grid min-h-[calc(100svh-4.5rem)] items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-18">
          <div className="min-w-0 max-w-3xl">
            <Badge variant="accent">Rosario · Desde 1990</Badge>
            <h1 className="mt-6 max-w-full font-display text-[clamp(3rem,14vw,7.5rem)] font-bold uppercase leading-[0.84] tracking-[-0.025em] text-foreground">
              Alcohol
              <span className="block text-accent">Rockería</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-7 text-foreground-secondary sm:text-xl sm:leading-8">
              Desde 1990 junto al Rock. Indumentaria, accesorios y cultura
              rockera en el corazón de Rosario.
            </p>
            <div className="mt-8 flex max-w-full flex-col gap-3 sm:flex-row">
              <a
                href="#productos"
                className={buttonStyles({
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                Ver productos
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href="#historia"
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                Nuestra historia
              </a>
            </div>
          </div>

          <div className="relative mx-auto hidden min-w-0 w-full max-w-lg lg:block">
            <div className="absolute inset-12 rounded-full bg-accent/12 blur-3xl" />
            <Image
              src="/branding/alcohol-rockeria-logo.png"
              alt="Logo de Alcohol Rockería con guitarras, mano rockera y estrellas"
              width={640}
              height={640}
              className="relative h-auto w-full object-contain drop-shadow-[0_24px_60px_rgba(242,196,0,0.14)]"
              priority
            />
          </div>
        </Container>
      </section>

      <Section
        id="categorias"
        eyebrow="Explorá"
        title="Categorías"
        description="Una muestra visual de cómo se organizará el catálogo. El contenido dinámico llegará en fases posteriores."
      >
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {categoriasDemostracion.map((categoria, indice) => (
            <Card
              key={categoria}
              className="group relative min-h-40 overflow-hidden bg-surface-raised p-5 sm:min-h-52"
            >
              <div className="absolute inset-0 bg-grain opacity-20 transition-opacity group-hover:opacity-40" />
              <span className="relative text-xs font-bold tracking-[0.2em] text-muted">
                0{indice + 1}
              </span>
              <h3 className="absolute bottom-5 left-5 right-5 font-display text-3xl font-bold uppercase leading-none tracking-wide text-foreground sm:text-4xl">
                {categoria}
              </h3>
              <span
                aria-hidden="true"
                className="absolute -right-5 -top-7 font-display text-8xl font-bold text-accent/8"
              >
                ★
              </span>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="bandas"
        className="border-y border-border bg-background-secondary"
        eyebrow="Encontrá tu sonido"
        title="Bandas"
      >
        <div className="flex flex-wrap gap-3">
          {bandasDemostracion.map((banda) => (
            <span
              key={banda}
              className="inline-flex min-h-12 items-center rounded-sm border border-border bg-surface px-5 font-display text-lg font-bold uppercase tracking-[0.08em] text-foreground"
            >
              <span aria-hidden="true" className="mr-3 text-accent">
                ★
              </span>
              {banda}
            </span>
          ))}
        </div>
      </Section>

      <Section
        id="productos"
        eyebrow="Selección visual"
        title="Productos destacados"
        description="Cards de demostración para validar jerarquía, estados y comportamiento responsive. No corresponden a un catálogo real."
      >
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productosDemostracion.map((producto) => (
            <TarjetaProducto key={producto.nombre} {...producto} />
          ))}
        </div>
      </Section>

      <Section
        id="historia"
        className="relative overflow-hidden border-y border-border bg-accent text-accent-foreground"
        contentClassName="relative"
      >
        <div className="absolute inset-0 bg-grain opacity-25" />
        <div className="relative grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <p className="font-display text-7xl font-bold uppercase leading-[0.82] tracking-[-0.03em] sm:text-8xl lg:text-9xl">
            36
            <span className="block text-3xl tracking-[0.08em] sm:text-4xl">
              años
            </span>
          </p>
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em]">
              Trayectoria
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-none tracking-wide sm:text-5xl">
              Junto al Rock
            </h2>
            <p className="mt-5 text-base font-medium leading-7 sm:text-lg sm:leading-8">
              Una historia construida entre música, identidad y comunidad. Esta
              sección queda preparada para contar la trayectoria del local con
              contenido configurable más adelante.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="local"
        eyebrow="El Local"
        title="Nos vemos en Rosario"
        description="Espacios visuales preparados para los datos definitivos del comercio."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent>
              <p className="eyebrow">Dirección</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                A configurar
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Rosario, Santa Fe
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="eyebrow">Horarios</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                A configurar
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Días y horarios de atención
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="eyebrow">Contacto</p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                Próximamente
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Instagram y WhatsApp
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </main>
  );
}
