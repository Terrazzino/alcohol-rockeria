import { Badge } from "@/components/ui/badge";
import { formatearPrecioArgentino } from "@/domain/productos";
import {
  obtenerPrecioEfectivo,
  type VarianteListado,
} from "@/domain/variantes";
import { AccionesVariante } from "@/features/variantes/acciones-variante";

interface ListadoVariantesProps {
  productoId: string;
  precioBase: string;
  variantes: VarianteListado[];
}

function PrecioVariante({
  precioBase,
  precioEspecifico,
}: {
  precioBase: string;
  precioEspecifico: string | null;
}) {
  const precioEfectivo = obtenerPrecioEfectivo(precioBase, precioEspecifico);

  return (
    <div>
      <p className="font-semibold text-accent">
        {formatearPrecioArgentino(precioEfectivo.precio)}
      </p>
      <p className="mt-1 text-xs text-muted">
        {precioEfectivo.usaPrecioBase ? "Usa precio base" : "Precio específico"}
      </p>
    </div>
  );
}

export function ListadoVariantes({
  productoId,
  precioBase,
  variantes,
}: ListadoVariantesProps) {
  return (
    <section aria-labelledby="titulo-listado-variantes">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="titulo-listado-variantes"
          className="font-display text-2xl font-bold uppercase tracking-wide"
        >
          Variantes cargadas
        </h2>
        <p className="text-sm text-muted">
          {variantes.length} {variantes.length === 1 ? "variante" : "variantes"}
        </p>
      </div>

      <div className="grid gap-4 md:hidden">
        {variantes.map((variante) => (
          <article
            key={variante.id}
            className="min-w-0 rounded-sm border border-border bg-surface p-4 shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words font-display text-2xl font-bold uppercase tracking-wide">
                  {variante.nombre}
                </h3>
                <p className="mt-1 break-all text-xs text-muted">
                  {variante.sku ?? "Sin SKU"}
                </p>
              </div>
              <Badge variant={variante.estaDisponible ? "success" : "neutral"}>
                {variante.estaDisponible ? "Disponible" : "No disponible"}
              </Badge>
            </div>

            <div className="my-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Precio efectivo
                </p>
                <div className="mt-1">
                  <PrecioVariante
                    precioBase={precioBase}
                    precioEspecifico={variante.precioEspecifico}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Orden
                </p>
                <p className="mt-1 font-semibold">{variante.orden}</p>
              </div>
            </div>
            <AccionesVariante productoId={productoId} {...variante} />
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-sm border border-border bg-surface shadow-card md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-surface-raised text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="w-[24%] px-4 py-3 font-bold">Variante</th>
              <th className="w-[20%] px-4 py-3 font-bold">Precio efectivo</th>
              <th className="w-[14%] px-4 py-3 font-bold">Disponibilidad</th>
              <th className="w-[8%] px-4 py-3 font-bold">Orden</th>
              <th className="w-[34%] px-4 py-3 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {variantes.map((variante) => (
              <tr key={variante.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="break-words font-semibold text-foreground">
                    {variante.nombre}
                  </p>
                  <p className="mt-1 break-all text-xs text-muted">
                    {variante.sku ?? "Sin SKU"}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm">
                  <PrecioVariante
                    precioBase={precioBase}
                    precioEspecifico={variante.precioEspecifico}
                  />
                </td>
                <td className="px-4 py-4">
                  <Badge
                    variant={variante.estaDisponible ? "success" : "neutral"}
                  >
                    {variante.estaDisponible ? "Disponible" : "No disponible"}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm">{variante.orden}</td>
                <td className="px-4 py-4">
                  <AccionesVariante productoId={productoId} {...variante} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
