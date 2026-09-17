import type { Metadata } from "next";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { FormularioBanda } from "@/features/bandas/formulario-banda";

export const metadata: Metadata = {
  title: "Nueva banda | Administración",
};

export default function PaginaNuevaBanda() {
  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Nueva banda"
        descripcion="Creá una banda para relacionarla con productos. Podés dejarla oculta hasta que esté lista."
        etiqueta="Bandas"
      />
      <div className="pt-7 sm:pt-8">
        <FormularioBanda />
      </div>
    </>
  );
}
