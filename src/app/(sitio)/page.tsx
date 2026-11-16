import { Section } from "@/components/ui/section";
import { obtenerCatalogoPublico } from "@/data/catalogo-publico";
import { obtenerInicioPublico } from "@/data/inicio";
import {
  normalizarCriteriosCatalogo,
  type ParametrosUrlCatalogo,
} from "@/domain/catalogo-publico";
import {
  BandasPublicas,
  CategoriasPublicas,
  FiltrosCatalogoPublico,
  ProductosPublicos,
} from "@/features/catalogo/catalogo-publico";
import {
  ContactoInicio,
  HeroInicio,
  InformacionLocalInicio,
  ProductosDestacadosInicio,
  TrayectoriaInicio,
} from "@/features/inicio/portada";

export const dynamic = "force-dynamic";

interface PaginaInicioProps {
  searchParams: Promise<ParametrosUrlCatalogo>;
}

export default async function PaginaInicio({
  searchParams,
}: PaginaInicioProps) {
  const parametros = await searchParams;
  const criterios = normalizarCriteriosCatalogo(parametros);
  const [catalogo, inicio] = await Promise.all([
    obtenerCatalogoPublico(criterios),
    obtenerInicioPublico(),
  ]);

  return (
    <main id="contenido-principal" className="flex-1">
      <HeroInicio configuracion={inicio.configuracion} />

      <Section
        id="categorias"
        eyebrow="Explorá"
        title="Categorías"
        description="Elegí una categoría para aplicar ese filtro al catálogo."
      >
        <CategoriasPublicas categorias={catalogo.categorias} />
      </Section>

      <Section
        id="bandas"
        className="border-y border-border bg-background-secondary"
        eyebrow="Encontrá tu sonido"
        title="Bandas"
        description="Accedé directamente a los productos de cada banda visible."
      >
        <BandasPublicas bandas={catalogo.bandas} />
      </Section>

      <ProductosDestacadosInicio productos={inicio.destacados} />

      <Section
        id="productos"
        eyebrow="Catálogo actual"
        title="Todos los productos"
        description="Buscá y combiná filtros sobre los productos publicados por el comercio."
      >
        <FiltrosCatalogoPublico
          categorias={catalogo.categorias}
          bandas={catalogo.bandas}
          criterios={catalogo.criterios}
          totalResultados={catalogo.paginacion.totalProductos}
        />
        <ProductosPublicos
          criterios={catalogo.criterios}
          productos={catalogo.productos}
          paginacion={catalogo.paginacion}
        />
      </Section>

      <TrayectoriaInicio configuracion={inicio.configuracion} />
      <InformacionLocalInicio configuracion={inicio.configuracion} />
      <ContactoInicio configuracion={inicio.configuracion} />
    </main>
  );
}
