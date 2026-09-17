import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";
import { obtenerProductos } from "@/data/productos";
import { ListadoProductos } from "@/features/productos/listado-productos";

export const metadata: Metadata = { title: "Productos | Administración" };

interface PaginaProductosProps {
  searchParams: Promise<{ resultado?: string | string[] }>;
}

const mensajesResultado: Record<string, string> = {
  creado: "El producto se creó correctamente.",
  actualizado: "El producto se actualizó correctamente.",
};

export default async function PaginaProductos({
  searchParams,
}: PaginaProductosProps) {
  const [productos, parametros] = await Promise.all([
    obtenerProductos(),
    searchParams,
  ]);
  const resultado = Array.isArray(parametros.resultado)
    ? parametros.resultado[0]
    : parametros.resultado;
  const mensaje = resultado ? mensajesResultado[resultado] : undefined;

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Productos"
        descripcion="Gestioná la información, disponibilidad y relaciones de cada producto del catálogo."
        etiqueta="Catálogo"
        acciones={
          <Link href="/admin/productos/nuevo" className={buttonStyles()}>
            Crear producto
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
        {productos.length === 0 ? (
          <EstadoVacioAdmin
            titulo="No hay productos todavía"
            descripcion="Creá el primer producto para empezar a construir el catálogo. No se cargaron datos automáticos."
            accion={
              <Link href="/admin/productos/nuevo" className={buttonStyles()}>
                Crear primer producto
              </Link>
            }
          />
        ) : (
          <ListadoProductos productos={productos} />
        )}
      </div>
    </>
  );
}
