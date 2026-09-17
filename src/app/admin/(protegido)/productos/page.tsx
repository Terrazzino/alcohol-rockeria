import type { Metadata } from "next";

import { PaginaSeccionProxima } from "@/components/admin/pagina-seccion-proxima";

export const metadata: Metadata = { title: "Productos | Administración" };

export default function PaginaProductos() {
  return (
    <PaginaSeccionProxima
      titulo="Productos"
      descripcion="Gestioná la información, disponibilidad y relaciones de cada producto del catálogo."
      etiquetaAccion="Nuevo producto"
      fase="Fase 7"
    />
  );
}
