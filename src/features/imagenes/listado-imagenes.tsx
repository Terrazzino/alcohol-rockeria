import type { ImagenProductoListado } from "@/domain/imagenes";
import { TarjetaImagen } from "@/features/imagenes/tarjeta-imagen";

export function ListadoImagenes({
  productoId,
  imagenes,
}: {
  productoId: string;
  imagenes: ImagenProductoListado[];
}) {
  return (
    <section aria-labelledby="titulo-imagenes-cargadas">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="titulo-imagenes-cargadas"
          className="font-display text-2xl font-bold uppercase tracking-wide"
        >
          Imágenes cargadas
        </h2>
        <p className="text-sm text-muted">
          {imagenes.length} {imagenes.length === 1 ? "imagen" : "imágenes"}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {imagenes.map((imagen) => (
          <TarjetaImagen key={imagen.id} productoId={productoId} {...imagen} />
        ))}
      </div>
    </section>
  );
}
