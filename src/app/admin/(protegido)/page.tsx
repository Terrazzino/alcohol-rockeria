import type { Metadata } from "next";

import { BadgeEstadoAdmin } from "@/components/admin/badge-estado-admin";
import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { TarjetaResumenAdmin } from "@/components/admin/tarjeta-resumen-admin";
import { seccionesNavegacionAdmin } from "@/features/admin/navegacion-admin";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export const metadata: Metadata = {
  title: "Panel de administración | Alcohol Rockería",
};

const accesosDashboard = new Set([
  "/admin/productos",
  "/admin/categorias",
  "/admin/bandas",
  "/admin/precios",
  "/admin/configuracion",
]);

export default async function PanelAdministracion() {
  const administrador = await exigirAdministradorActivo();
  const nombreVisible = administrador.nombre?.split(" ")[0] ?? "Administrador";
  const accesos = seccionesNavegacionAdmin.filter((seccion) =>
    accesosDashboard.has(seccion.href),
  );

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Panel de administración"
        descripcion="Administrá el catálogo y la configuración de Alcohol Rockería desde un espacio claro y preparado para el trabajo diario."
        etiqueta={`Hola, ${nombreVisible}`}
        acciones={<BadgeEstadoAdmin estado="activo" />}
      />

      <section className="py-7 sm:py-8" aria-labelledby="accesos-panel">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="accesos-panel"
            className="font-display text-2xl font-bold uppercase tracking-wide text-foreground"
          >
            Accesos principales
          </h2>
          <p className="hidden text-xs font-bold uppercase tracking-[0.12em] text-muted sm:block">
            Base visual · Fase 4
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accesos.map((seccion) => (
            <TarjetaResumenAdmin
              key={seccion.href}
              titulo={seccion.etiqueta}
              descripcion={seccion.descripcion}
              href={seccion.href}
              icono={seccion.icono}
            />
          ))}
        </div>
      </section>
    </>
  );
}
