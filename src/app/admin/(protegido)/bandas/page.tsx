import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";
import { obtenerBandas } from "@/data/bandas";
import { ListadoBandas } from "@/features/bandas/listado-bandas";

export const metadata: Metadata = { title: "Bandas | Administración" };

interface PaginaBandasProps {
  searchParams: Promise<{ resultado?: string | string[] }>;
}

const mensajesResultado: Record<string, string> = {
  creada: "La banda se creó correctamente.",
  actualizada: "La banda se actualizó correctamente.",
};

export default async function PaginaBandas({
  searchParams,
}: PaginaBandasProps) {
  const [bandas, parametros] = await Promise.all([
    obtenerBandas(),
    searchParams,
  ]);
  const resultado = Array.isArray(parametros.resultado)
    ? parametros.resultado[0]
    : parametros.resultado;
  const mensaje = resultado ? mensajesResultado[resultado] : undefined;

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Bandas"
        descripcion="Administrá las bandas que funcionarán como una de las entradas principales al catálogo."
        etiqueta="Catálogo"
        acciones={
          <Link href="/admin/bandas/nueva" className={buttonStyles()}>
            Crear banda
          </Link>
        }
      />

      {mensaje ? (
        <p
          role="status"
          className="mt-6 rounded-sm border border-success/40 bg-success-soft p-4 text-sm text-success"
        >
          {mensaje}
        </p>
      ) : null}

      <div className="pt-7 sm:pt-8">
        {bandas.length === 0 ? (
          <EstadoVacioAdmin
            titulo="No hay bandas todavía"
            descripcion="Creá la primera banda para empezar a organizar el catálogo. No se cargaron datos automáticos."
            accion={
              <Link href="/admin/bandas/nueva" className={buttonStyles()}>
                Crear primera banda
              </Link>
            }
          />
        ) : (
          <ListadoBandas bandas={bandas} />
        )}
      </div>
    </>
  );
}
