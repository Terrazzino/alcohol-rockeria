import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { obtenerCategoriaPorId } from "@/data/categorias";
import { FormularioCategoria } from "@/features/categorias/formulario-categoria";

export const metadata: Metadata = {
  title: "Editar categoría | Administración",
};

interface PaginaEditarCategoriaProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaEditarCategoria({
  params,
}: PaginaEditarCategoriaProps) {
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const categoria = await obtenerCategoriaPorId(id);
  if (!categoria) notFound();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Editar categoría"
        descripcion={`Actualizá la información y visibilidad de “${categoria.nombre}”.`}
        etiqueta="Categorías"
      />
      <div className="pt-7 sm:pt-8">
        <FormularioCategoria categoria={categoria} />
      </div>
    </>
  );
}
