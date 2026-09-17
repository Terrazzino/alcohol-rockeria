import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { cerrarSesion } from "@/features/autenticacion/acciones";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export const metadata: Metadata = {
  title: "Panel de administración | Alcohol Rockería",
};

const secciones = [
  "Productos",
  "Categorías",
  "Bandas",
  "Precios",
  "Configuración",
] as const;

export default async function PanelAdministracion() {
  const administrador = await exigirAdministradorActivo();
  const nombreVisible = administrador.nombre ?? administrador.correo;

  return (
    <main id="contenido-principal" className="flex-1 py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Área privada</p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-none tracking-wide text-foreground sm:text-5xl">
              Panel de administración
            </h1>
            <p className="mt-4 text-foreground-secondary">
              Bienvenido,{" "}
              <span className="text-foreground">{nombreVisible}</span>.
            </p>
          </div>

          <form action={cerrarSesion}>
            <Button
              variant="secondary"
              type="submit"
              className="w-full sm:w-auto"
            >
              Cerrar sesión
            </Button>
          </form>
        </div>

        <section className="py-8" aria-labelledby="secciones-panel">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="secciones-panel"
              className="font-display text-2xl font-bold uppercase tracking-wide"
            >
              Gestión
            </h2>
            <Badge variant="accent">Fase 3</Badge>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {secciones.map((seccion) => (
              <Card key={seccion} aria-disabled="true" className="opacity-75">
                <CardContent>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide">
                    {seccion}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-foreground-secondary">
                    Próximamente en las siguientes fases del panel.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
