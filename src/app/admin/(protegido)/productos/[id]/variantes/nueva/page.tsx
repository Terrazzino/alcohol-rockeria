import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { obtenerProductoParaVariantes } from "@/data/variantes";
import { FormularioVariante } from "@/features/variantes/formulario-variante";

export const metadata: Metadata = {
  title: "Nueva variante | Administración",
};

interface PaginaNuevaVarianteProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaNuevaVariante({
  params,
}: PaginaNuevaVarianteProps) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const producto = await obtenerProductoParaVariantes(id);
  if (!producto) notFound();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Nueva variante"
        descripcion={`Agregá una opción para “${producto.nombre}”.`}
        etiqueta="Variantes"
      />
      <div className="pt-7 sm:pt-8">
        <FormularioVariante producto={producto} />
      </div>
    </>
  );
}
