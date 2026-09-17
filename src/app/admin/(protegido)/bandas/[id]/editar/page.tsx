import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { obtenerBandaPorId } from "@/data/bandas";
import { FormularioBanda } from "@/features/bandas/formulario-banda";

export const metadata: Metadata = {
  title: "Editar banda | Administración",
};

interface PaginaEditarBandaProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaEditarBanda({
  params,
}: PaginaEditarBandaProps) {
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const banda = await obtenerBandaPorId(id);
  if (!banda) notFound();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Editar banda"
        descripcion={`Actualizá la información y visibilidad de “${banda.nombre}”.`}
        etiqueta="Bandas"
      />
      <div className="pt-7 sm:pt-8">
        <FormularioBanda banda={banda} />
      </div>
    </>
  );
}
