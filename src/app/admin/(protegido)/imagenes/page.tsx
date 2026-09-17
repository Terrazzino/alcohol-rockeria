import type { Metadata } from "next";

import { PaginaSeccionProxima } from "@/components/admin/pagina-seccion-proxima";

export const metadata: Metadata = { title: "Imágenes | Administración" };

export default function PaginaImagenes() {
  return (
    <PaginaSeccionProxima
      titulo="Imágenes"
      descripcion="Administrá las referencias visuales que tendrán protagonismo en cada producto."
      etiquetaAccion="Agregar imagen"
      fase="Fase 9"
    />
  );
}
