import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";

export default function ProductoNoEncontrado() {
  return (
    <main id="contenido-principal" className="flex-1 py-14 sm:py-18">
      <Container>
        <ErrorState
          title="Producto no encontrado"
          description="El producto no existe o no está disponible públicamente."
          action={
            <Link
              href="/#productos"
              className={buttonStyles({ variant: "secondary" })}
            >
              Volver al catálogo
            </Link>
          }
        />
      </Container>
    </main>
  );
}
