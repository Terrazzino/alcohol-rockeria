import type { Metadata } from "next";

import { PaginaSeccionProxima } from "@/components/admin/pagina-seccion-proxima";

export const metadata: Metadata = { title: "Configuración | Administración" };

export default function PaginaConfiguracion() {
  return (
    <PaginaSeccionProxima
      titulo="Configuración"
      descripcion="Centralizá los datos públicos, textos y canales de contacto de Alcohol Rockería."
      etiquetaAccion="Editar configuración"
      fase="Fase 11"
    />
  );
}
