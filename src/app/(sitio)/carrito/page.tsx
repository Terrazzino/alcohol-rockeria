import { obtenerNumeroWhatsappPublico } from "@/data/configuracion-tienda";
import { VistaCarrito } from "@/features/carrito/vista-carrito";

export const dynamic = "force-dynamic";

export default async function PaginaCarrito() {
  const numeroWhatsapp = await obtenerNumeroWhatsappPublico();

  return <VistaCarrito numeroWhatsapp={numeroWhatsapp} />;
}
