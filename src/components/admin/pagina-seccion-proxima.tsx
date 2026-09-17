import { BarraAccionesAdmin } from "@/components/admin/barra-acciones-admin";
import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { Button } from "@/components/ui/button";

interface PaginaSeccionProximaProps {
  titulo: string;
  descripcion: string;
  etiquetaAccion: string;
  fase: string;
}

export function PaginaSeccionProxima({
  titulo,
  descripcion,
  etiquetaAccion,
  fase,
}: PaginaSeccionProximaProps) {
  return (
    <>
      <EncabezadoPaginaAdmin
        titulo={titulo}
        descripcion={descripcion}
        etiqueta={`Módulo futuro · ${fase}`}
      />

      <section className="mt-7 grid gap-4" aria-label={`Listado de ${titulo}`}>
        <BarraAccionesAdmin
          accionPrincipal={
            <Button disabled className="w-full sm:w-auto">
              {etiquetaAccion}
            </Button>
          }
        />
        <EstadoVacioAdmin
          titulo="Módulo en preparación"
          descripcion="La estructura visual está lista. Los datos, filtros y operaciones se incorporarán en la fase correspondiente."
        />
      </section>
    </>
  );
}
