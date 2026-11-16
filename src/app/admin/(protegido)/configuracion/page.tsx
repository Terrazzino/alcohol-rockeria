import type { Metadata } from "next";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { obtenerConfiguracionTienda } from "@/data/configuracion-tienda";
import { FormularioConfiguracion } from "@/features/configuracion/formulario-configuracion";

export const metadata: Metadata = { title: "Configuración | Administración" };

interface PaginaConfiguracionProps {
  searchParams: Promise<{ resultado?: string | string[] }>;
}

export default async function PaginaConfiguracion({
  searchParams,
}: PaginaConfiguracionProps) {
  const [configuracion, parametros] = await Promise.all([
    obtenerConfiguracionTienda(),
    searchParams,
  ]);
  const resultado = Array.isArray(parametros.resultado)
    ? parametros.resultado[0]
    : parametros.resultado;

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Configuración"
        descripcion="Centralizá la identidad, los datos de contacto y los textos institucionales del comercio."
        etiqueta="Comercio"
      />

      {resultado === "guardada" ? (
        <p
          role="status"
          className="mt-6 rounded-sm border border-success/40 bg-success-soft p-4 text-sm text-success"
        >
          La configuración se guardó correctamente.
        </p>
      ) : null}

      {!configuracion ? (
        <p className="mt-6 rounded-sm border border-accent/40 bg-accent-soft p-4 text-sm text-foreground-secondary">
          Todavía no existe una configuración guardada. El primer guardado
          creará el registro único de la tienda.
        </p>
      ) : null}

      <div className="pt-7 sm:pt-8">
        <FormularioConfiguracion configuracion={configuracion} />
      </div>
    </>
  );
}
