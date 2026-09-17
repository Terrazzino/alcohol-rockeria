import type { Metadata } from "next";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { FormularioCategoria } from "@/features/categorias/formulario-categoria";

export const metadata: Metadata = {
  title: "Nueva categoría | Administración",
};

export default function PaginaNuevaCategoria() {
  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Nueva categoría"
        descripcion="Creá una categoría para organizar productos. Podés dejarla oculta hasta que esté lista."
        etiqueta="Categorías"
      />
      <div className="pt-7 sm:pt-8">
        <FormularioCategoria />
      </div>
    </>
  );
}
