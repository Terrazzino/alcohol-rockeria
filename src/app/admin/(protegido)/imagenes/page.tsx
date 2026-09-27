import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";
import { obtenerProductosParaImagenes } from "@/data/imagenes";
import { ListadoProductosImagenes } from "@/features/imagenes/listado-productos-imagenes";

export const metadata: Metadata = { title: "Imágenes | Administración" };

export default async function PaginaImagenes() {
  const productos = await obtenerProductosParaImagenes();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Imágenes"
        descripcion="Elegí un producto para subir, ordenar y describir sus imágenes."
        etiqueta="Catálogo"
      />
      <div className="pt-7 sm:pt-8">
        {productos.length === 0 ? (
          <EstadoVacioAdmin
            titulo="No hay productos todavía"
            descripcion="Primero creá un producto; luego vas a poder asociarle sus imágenes."
            accion={
              <Link href="/admin/productos/nuevo" className={buttonStyles()}>
                Crear producto
              </Link>
            }
          />
        ) : (
          <ListadoProductosImagenes productos={productos} />
        )}
      </div>
    </>
  );
}
