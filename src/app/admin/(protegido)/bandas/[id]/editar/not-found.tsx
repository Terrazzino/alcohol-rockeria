import Link from "next/link";

import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";

export default function BandaNoEncontrada() {
  return (
    <EstadoVacioAdmin
      titulo="Banda no encontrada"
      descripcion="La banda no existe o fue eliminada. Volvé al listado para continuar."
      accion={
        <Link href="/admin/bandas" className={buttonStyles()}>
          Volver a bandas
        </Link>
      }
    />
  );
}
