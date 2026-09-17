import { Badge } from "@/components/ui/badge";
import type { BandaListado } from "@/domain/bandas";
import { AccionesBanda } from "@/features/bandas/acciones-banda";

interface ListadoBandasProps {
  bandas: BandaListado[];
}

function EstadoBanda({ estaVisible }: { estaVisible: boolean }) {
  return (
    <Badge variant={estaVisible ? "success" : "neutral"}>
      {estaVisible ? "Visible" : "Oculta"}
    </Badge>
  );
}

export function ListadoBandas({ bandas }: ListadoBandasProps) {
  return (
    <section aria-labelledby="titulo-listado-bandas">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="titulo-listado-bandas"
          className="font-display text-2xl font-bold uppercase tracking-wide"
        >
          Bandas cargadas
        </h2>
        <p className="text-sm text-muted">
          {bandas.length} {bandas.length === 1 ? "banda" : "bandas"}
        </p>
      </div>

      <div className="grid gap-4 md:hidden">
        {bandas.map((banda) => (
          <article
            key={banda.id}
            className="min-w-0 rounded-sm border border-border bg-surface p-4 shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words font-display text-2xl font-bold uppercase tracking-wide">
                  {banda.nombre}
                </h3>
                <p className="mt-1 break-all text-xs text-muted">
                  /{banda.slug}
                </p>
              </div>
              <EstadoBanda estaVisible={banda.estaVisible} />
            </div>
            {banda.descripcion ? (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground-secondary">
                {banda.descripcion}
              </p>
            ) : null}
            <dl className="my-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Orden
                </dt>
                <dd className="mt-1 font-semibold">{banda.orden}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Productos
                </dt>
                <dd className="mt-1 font-semibold">
                  {banda.cantidadProductos}
                </dd>
              </div>
            </dl>
            <AccionesBanda {...banda} />
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-sm border border-border bg-surface shadow-card md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-surface-raised text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="w-[32%] px-4 py-3 font-bold">Banda</th>
              <th className="w-[12%] px-4 py-3 font-bold">Estado</th>
              <th className="w-[10%] px-4 py-3 font-bold">Orden</th>
              <th className="w-[12%] px-4 py-3 font-bold">Productos</th>
              <th className="w-[34%] px-4 py-3 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bandas.map((banda) => (
              <tr key={banda.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="break-words font-semibold text-foreground">
                    {banda.nombre}
                  </p>
                  <p className="mt-1 break-all text-xs text-muted">
                    /{banda.slug}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <EstadoBanda estaVisible={banda.estaVisible} />
                </td>
                <td className="px-4 py-4 text-sm">{banda.orden}</td>
                <td className="px-4 py-4 text-sm">{banda.cantidadProductos}</td>
                <td className="px-4 py-4">
                  <AccionesBanda {...banda} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
