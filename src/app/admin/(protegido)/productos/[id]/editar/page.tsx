import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import {
  obtenerOpcionesRelacionesProducto,
  obtenerProductoPorId,
} from "@/data/productos";
import { FormularioProducto } from "@/features/productos/formulario-producto";

export const metadata: Metadata = {
  title: "Editar producto | Administración",
};

interface PaginaEditarProductoProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaEditarProducto({
  params,
}: PaginaEditarProductoProps) {
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const [producto, relaciones] = await Promise.all([
    obtenerProductoPorId(id),
    obtenerOpcionesRelacionesProducto(),
  ]);
  if (!producto) notFound();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Editar producto"
        descripcion={`Actualizá la información comercial de “${producto.nombre}”.`}
        etiqueta="Productos"
      />
      <div className="pt-7 sm:pt-8">
        <FormularioProducto
          producto={producto}
          categorias={relaciones.categorias}
          bandas={relaciones.bandas}
        />
      </div>
    </>
  );
}
