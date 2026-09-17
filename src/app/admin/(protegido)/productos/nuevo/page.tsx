import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";
import { obtenerOpcionesRelacionesProducto } from "@/data/productos";
import { FormularioProducto } from "@/features/productos/formulario-producto";

export const metadata: Metadata = {
  title: "Nuevo producto | Administración",
};

export default async function PaginaNuevoProducto() {
  const { categorias, bandas } = await obtenerOpcionesRelacionesProducto();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Nuevo producto"
        descripcion="Cargá la información comercial y vinculá el producto con una categoría y, si corresponde, una banda."
        etiqueta="Productos"
      />
      <div className="pt-7 sm:pt-8">
        {categorias.length === 0 ? (
          <EstadoVacioAdmin
            titulo="Primero creá una categoría"
            descripcion="Todo producto necesita una categoría válida. Cuando exista al menos una, vas a poder continuar con la carga."
            accion={
              <Link href="/admin/categorias/nueva" className={buttonStyles()}>
                Crear categoría
              </Link>
            }
          />
        ) : (
          <FormularioProducto categorias={categorias} bandas={bandas} />
        )}
      </div>
    </>
  );
}
