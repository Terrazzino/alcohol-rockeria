import Link from "next/link";

import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";

export default function ProductoNoEncontrado() {
  return (
    <EstadoVacioAdmin
      titulo="Producto no encontrado"
      descripcion="El producto no existe o fue eliminado. Volvé al listado para continuar."
      accion={
        <Link href="/admin/productos" className={buttonStyles()}>
          Volver a productos
        </Link>
      }
    />
  );
}
