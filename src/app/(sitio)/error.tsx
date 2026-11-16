"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";

export default function ErrorSitioPublico({ reset }: { reset: () => void }) {
  return (
    <main id="contenido-principal" className="flex-1 py-14 sm:py-18">
      <Container>
        <ErrorState
          title="No pudimos cargar el catálogo"
          description="Ocurrió un problema al consultar los datos. Intentá nuevamente."
          action={<Button onClick={reset}>Reintentar</Button>}
        />
      </Container>
    </main>
  );
}
