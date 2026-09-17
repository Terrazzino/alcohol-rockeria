import type { Metadata } from "next";

import { PaginaSeccionProxima } from "@/components/admin/pagina-seccion-proxima";

export const metadata: Metadata = { title: "Bandas | Administración" };

export default function PaginaBandas() {
  return (
    <PaginaSeccionProxima
      titulo="Bandas"
      descripcion="Prepará las bandas que funcionarán como una de las entradas principales al catálogo."
      etiquetaAccion="Nueva banda"
      fase="Fase 6"
    />
  );
}
