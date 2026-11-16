import { notFound } from "next/navigation";

import { obtenerNumeroWhatsappPublico } from "@/data/configuracion-tienda";
import { obtenerDetalleProductoPublico } from "@/data/detalle-producto";
import { normalizarSlugProductoPublico } from "@/domain/detalle-producto";
import { DetalleProducto } from "@/features/catalogo/detalle-producto";

export const dynamic = "force-dynamic";

interface PaginaDetalleProductoProps {
  params: Promise<{ slug: string }>;
}

export default async function PaginaDetalleProducto({
  params,
}: PaginaDetalleProductoProps) {
  const { slug: slugRecibido } = await params;
  const slug = normalizarSlugProductoPublico(slugRecibido);

  if (!slug) notFound();

  const [producto, numeroWhatsapp] = await Promise.all([
    obtenerDetalleProductoPublico(slug),
    obtenerNumeroWhatsappPublico(),
  ]);
  if (!producto) notFound();

  return (
    <DetalleProducto producto={producto} numeroWhatsapp={numeroWhatsapp} />
  );
}
