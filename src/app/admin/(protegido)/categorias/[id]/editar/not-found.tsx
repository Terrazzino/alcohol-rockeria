import Link from "next/link";

import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";

export default function CategoriaNoEncontrada() {
  return (
    <EstadoVacioAdmin
      titulo="Categoría no encontrada"
      descripcion="La categoría no existe o fue eliminada. Volvé al listado para continuar."
      accion={
        <Link href="/admin/categorias" className={buttonStyles()}>
          Volver a categorías
        </Link>
      }
    />
  );
}
