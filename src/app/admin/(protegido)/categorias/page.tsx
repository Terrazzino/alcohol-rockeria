import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";
import { obtenerCategorias } from "@/data/categorias";
import { ListadoCategorias } from "@/features/categorias/listado-categorias";

export const metadata: Metadata = { title: "Categorías | Administración" };

interface PaginaCategoriasProps {
  searchParams: Promise<{ resultado?: string | string[] }>;
}

const mensajesResultado: Record<string, string> = {
  creada: "La categoría se creó correctamente.",
  actualizada: "La categoría se actualizó correctamente.",
};

export default async function PaginaCategorias({
  searchParams,
}: PaginaCategoriasProps) {
  const [categorias, parametros] = await Promise.all([
    obtenerCategorias(),
    searchParams,
  ]);
  const resultado = Array.isArray(parametros.resultado)
    ? parametros.resultado[0]
    : parametros.resultado;
  const mensaje = resultado ? mensajesResultado[resultado] : undefined;

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Categorías"
        descripcion="Organizá los productos en grupos visibles y ordenados para facilitar la navegación del catálogo."
        etiqueta="Catálogo"
        acciones={
          <Link href="/admin/categorias/nueva" className={buttonStyles()}>
            Nueva categoría
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
        {categorias.length === 0 ? (
          <EstadoVacioAdmin
            titulo="Todavía no hay categorías"
            descripcion="Creá la primera categoría para empezar a organizar el catálogo. No se cargaron datos automáticos."
            accion={
              <Link href="/admin/categorias/nueva" className={buttonStyles()}>
                Crear primera categoría
              </Link>
            }
          />
        ) : (
          <ListadoCategorias categorias={categorias} />
        )}
      </div>
    </>
  );
}
