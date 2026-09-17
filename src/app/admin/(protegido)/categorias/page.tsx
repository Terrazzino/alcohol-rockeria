import type { Metadata } from "next";

import { PaginaSeccionProxima } from "@/components/admin/pagina-seccion-proxima";

export const metadata: Metadata = { title: "Categorías | Administración" };

export default function PaginaCategorias() {
  return (
    <PaginaSeccionProxima
      titulo="Categorías"
      descripcion="Organizá los productos en grupos visibles y ordenados para facilitar la navegación del catálogo."
      etiquetaAccion="Nueva categoría"
      fase="Fase 5"
    />
  );
}
