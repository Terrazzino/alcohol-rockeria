import { Badge } from "@/components/ui/badge";
import {
  ETIQUETAS_ESTADO_PRODUCTO,
  formatearPrecioArgentino,
  type EstadoProductoDominio,
  type ProductoListado,
} from "@/domain/productos";
import { AccionesProducto } from "@/features/productos/acciones-producto";

interface ListadoProductosProps {
  productos: ProductoListado[];
}

const varianteEstado: Record<
  EstadoProductoDominio,
  "success" | "error" | "neutral"
> = {
  ACTIVO: "success",
  SIN_STOCK: "error",
  OCULTO: "neutral",
};

function EstadoProducto({ estado }: { estado: EstadoProductoDominio }) {
  return (
    <Badge variant={varianteEstado[estado]}>
      {ETIQUETAS_ESTADO_PRODUCTO[estado]}
    </Badge>
  );
}

export function ListadoProductos({ productos }: ListadoProductosProps) {
  return (
    <section aria-labelledby="titulo-listado-productos">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="titulo-listado-productos"
          className="font-display text-2xl font-bold uppercase tracking-wide"
        >
          Productos cargados
        </h2>
        <p className="text-sm text-muted">
          {productos.length} {productos.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      <div className="grid gap-4 md:hidden">
        {productos.map((producto) => (
          <article
            key={producto.id}
            className="min-w-0 rounded-sm border border-border bg-surface p-4 shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words font-display text-2xl font-bold uppercase tracking-wide">
                  {producto.nombre}
                </h3>
                <p className="mt-2 text-xl font-bold text-accent">
                  {formatearPrecioArgentino(producto.precioBase)}
                </p>
              </div>
              <EstadoProducto estado={producto.estado} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {producto.destacado ? (
                <Badge variant="accent">Destacado</Badge>
              ) : null}
              <Badge>{producto.categoria.nombre}</Badge>
              <Badge>{producto.banda?.nombre ?? "Sin banda"}</Badge>
            </div>

            <dl className="my-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Slug
                </dt>
                <dd className="mt-1 break-all">/{producto.slug}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Orden
                </dt>
                <dd className="mt-1 font-semibold">
                  {producto.orden ?? "Sin orden"}
                </dd>
              </div>
            </dl>
            <AccionesProducto {...producto} />
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-sm border border-border bg-surface shadow-card md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-surface-raised text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="w-[20%] px-3 py-3 font-bold">Producto</th>
              <th className="w-[13%] px-3 py-3 font-bold">Relaciones</th>
              <th className="w-[13%] px-3 py-3 font-bold">Precio</th>
              <th className="w-[12%] px-3 py-3 font-bold">Estado</th>
              <th className="w-[8%] px-3 py-3 font-bold">Orden</th>
              <th className="w-[34%] px-3 py-3 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productos.map((producto) => (
              <tr key={producto.id} className="align-top">
                <td className="px-3 py-4">
                  <p className="break-words font-semibold text-foreground">
                    {producto.nombre}
                  </p>
                  <p className="mt-1 break-all text-xs text-muted">
                    /{producto.slug}
                  </p>
                  {producto.destacado ? (
                    <Badge variant="accent" className="mt-2">
                      Destacado
                    </Badge>
                  ) : null}
                </td>
                <td className="px-3 py-4 text-sm">
                  <p className="break-words">{producto.categoria.nombre}</p>
                  <p className="mt-1 break-words text-muted">
                    {producto.banda?.nombre ?? "Sin banda"}
                  </p>
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-accent">
                  {formatearPrecioArgentino(producto.precioBase)}
                </td>
                <td className="px-3 py-4">
                  <EstadoProducto estado={producto.estado} />
                </td>
                <td className="px-3 py-4 text-sm">{producto.orden ?? "—"}</td>
                <td className="px-3 py-4">
                  <AccionesProducto {...producto} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
