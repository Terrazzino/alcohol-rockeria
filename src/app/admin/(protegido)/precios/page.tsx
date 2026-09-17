import type { Metadata } from "next";

import { PaginaSeccionProxima } from "@/components/admin/pagina-seccion-proxima";

export const metadata: Metadata = { title: "Precios | Administración" };

export default function PaginaPrecios() {
  return (
    <PaginaSeccionProxima
      titulo="Precios"
      descripcion="Revisá y prepará futuras actualizaciones individuales o masivas con confirmación previa."
      etiquetaAccion="Actualizar precios"
      fase="Fase 10"
    />
  );
}
