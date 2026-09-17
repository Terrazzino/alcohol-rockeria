import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import {
  obtenerProductoParaVariantes,
  obtenerVariantePorId,
} from "@/data/variantes";
import { FormularioVariante } from "@/features/variantes/formulario-variante";

export const metadata: Metadata = {
  title: "Editar variante | Administración",
};

interface PaginaEditarVarianteProps {
  params: Promise<{ id: string; varianteId: string }>;
}

export default async function PaginaEditarVariante({
  params,
}: PaginaEditarVarianteProps) {
  const { id, varianteId } = await params;
  if (
    !z.uuid().safeParse(id).success ||
    !z.uuid().safeParse(varianteId).success
  ) {
    notFound();
  }

  const [producto, variante] = await Promise.all([
    obtenerProductoParaVariantes(id),
    obtenerVariantePorId(id, varianteId),
  ]);
  if (!producto || !variante) notFound();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Editar variante"
        descripcion={`Actualizá “${variante.nombre}” dentro de “${producto.nombre}”.`}
        etiqueta="Variantes"
      />
      <div className="pt-7 sm:pt-8">
        <FormularioVariante producto={producto} variante={variante} />
      </div>
    </>
  );
}
