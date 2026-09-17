import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FormularioInicioSesion } from "@/features/autenticacion/formulario-inicio-sesion";
import { obtenerAdministradorActual } from "@/features/autenticacion/sesion";

export const metadata: Metadata = {
  title: "Acceso administrativo | Alcohol Rockería",
};

export const dynamic = "force-dynamic";

export default async function PaginaInicioSesion() {
  const administrador = await obtenerAdministradorActual();

  if (administrador) {
    redirect("/admin");
  }

  return (
    <main
      id="contenido-principal"
      className="relative isolate flex flex-1 items-center overflow-hidden py-10 sm:py-16"
    >
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="absolute left-1/2 top-1/3 -z-10 size-72 -translate-x-1/2 rounded-full bg-accent/8 blur-3xl" />

      <Container className="max-w-lg">
        <Card className="border-border-strong bg-surface/95 shadow-elevated">
          <CardContent className="p-6 sm:p-8">
            <Image
              src="/branding/alcohol-rockeria-logo.png"
              alt=""
              width={96}
              height={96}
              className="mx-auto size-20 object-contain"
              priority
            />
            <p className="eyebrow mt-5 text-center">Acceso privado</p>
            <h1 className="mt-3 text-center font-display text-4xl font-bold uppercase leading-none tracking-wide text-foreground sm:text-5xl">
              Administración
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-foreground-secondary">
              Ingresá con las credenciales internas de Alcohol Rockería.
            </p>

            <FormularioInicioSesion />

            <p className="mt-6 text-center text-xs leading-5 text-muted">
              El acceso no permite registro público.
            </p>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
