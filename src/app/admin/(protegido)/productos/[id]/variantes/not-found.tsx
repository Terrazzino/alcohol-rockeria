import Link from "next/link";

import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { buttonStyles } from "@/components/ui/button";

export default function VarianteNoEncontrada() {
  return (
    <EstadoVacioAdmin
      titulo="Producto o variante no encontrados"
      descripcion="El recurso no existe o la variante no pertenece al producto indicado."
      accion={
        <Link href="/admin/productos" className={buttonStyles()}>
          Volver a productos
        </Link>
      }
    />
  );
}
