import type { Metadata } from "next";

import { PaginaSeccionProxima } from "@/components/admin/pagina-seccion-proxima";

export const metadata: Metadata = { title: "Variantes | Administración" };

export default function PaginaVariantes() {
  return (
    <PaginaSeccionProxima
      titulo="Variantes"
      descripcion="Definí talles, colores y otras opciones disponibles para cada producto."
      etiquetaAccion="Nueva variante"
      fase="Fase 8"
    />
  );
}
