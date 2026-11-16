import { Container } from "@/components/ui/container";
import { LoadingState } from "@/components/ui/loading-state";

export default function CargandoSitioPublico() {
  return (
    <main id="contenido-principal" className="flex-1 py-14 sm:py-18">
      <Container>
        <LoadingState label="Cargando el catálogo" />
      </Container>
    </main>
  );
}
