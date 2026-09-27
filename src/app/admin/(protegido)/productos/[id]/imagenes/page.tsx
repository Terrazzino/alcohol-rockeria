import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";
import {
  obtenerImagenesPorProducto,
  obtenerProductoParaImagenes,
} from "@/data/imagenes";
import { FormularioSubidaImagen } from "@/features/imagenes/formulario-subida-imagen";
import { ListadoImagenes } from "@/features/imagenes/listado-imagenes";

export const metadata: Metadata = {
  title: "Imágenes del producto | Administración",
};

interface PaginaImagenesProductoProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ resultado?: string | string[] }>;
}

export default async function PaginaImagenesProducto({
  params,
  searchParams,
}: PaginaImagenesProductoProps) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [producto, imagenes, parametros] = await Promise.all([
    obtenerProductoParaImagenes(id),
    obtenerImagenesPorProducto(id),
    searchParams,
  ]);
  if (!producto) notFound();

  const resultado = Array.isArray(parametros.resultado)
    ? parametros.resultado[0]
    : parametros.resultado;

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo={`Imágenes · ${producto.nombre}`}
        descripcion="Gestioná la galería de este producto. Siempre puede existir una sola imagen principal."
        etiqueta="Productos"
        acciones={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/imagenes"
              className={buttonStyles({ variant: "secondary" })}
            >
              Ver productos
            </Link>
            <Link
              href="/admin/productos"
              className={buttonStyles({ variant: "secondary" })}
            >
              Volver
            </Link>
          </div>
        }
      />

      {resultado === "subida" ? (
        <p
          role="status"
          className="mt-6 rounded-sm border border-success/40 bg-success-soft p-4 text-sm text-success"
        >
          La imagen se subió correctamente.
        </p>
      ) : null}

      <div className="mt-7">
        <FormularioSubidaImagen productoId={producto.id} />
      </div>

      <div className="pt-7 sm:pt-8">
        {imagenes.length === 0 ? (
          <EstadoVacioAdmin
            titulo="Este producto no tiene imágenes"
            descripcion="Seleccioná un archivo en el formulario anterior para crear la galería. La primera imagen será principal automáticamente."
          />
        ) : (
          <ListadoImagenes productoId={producto.id} imagenes={imagenes} />
        )}
      </div>
    </>
  );
}
