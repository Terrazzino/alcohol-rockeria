import {
  calcularSubtotalItemCarrito,
  calcularTotalCarrito,
  centavosAPrecioCarrito,
  type ItemCarrito,
} from "./carrito";
import { obtenerNumeroWhatsappValido } from "./configuracion-tienda";
import { formatearPrecioArgentino } from "./productos";

const URL_WHATSAPP = "https://wa.me";

function formatearCentavos(centavos: number): string {
  return formatearPrecioArgentino(centavosAPrecioCarrito(centavos));
}

function generarBloqueItem(item: ItemCarrito): string {
  const lineas = [`${item.cantidad} x ${item.nombre}`];

  if (item.variante) {
    lineas.push(`Variante: ${item.variante.nombre}`);
  }

  lineas.push(
    `Precio unitario de referencia: ${formatearPrecioArgentino(item.precioUnitario)}`,
    `Subtotal de referencia: ${formatearCentavos(calcularSubtotalItemCarrito(item))}`,
  );

  return lineas.join("\n");
}

export function generarMensajeConsultaWhatsApp(
  items: ItemCarrito[],
): string | null {
  if (items.length === 0) return null;

  const detalle = items.map(generarBloqueItem).join("\n\n");
  const total = formatearCentavos(calcularTotalCarrito(items));

  return [
    "¡Hola! Quiero consultar por estos productos de Alcohol Rockería:",
    detalle,
    `Total informativo de referencia: ${total}`,
    "Los precios y la disponibilidad se confirman al realizar la consulta.",
    "¿Tienen disponibilidad?",
  ].join("\n\n");
}

export function crearUrlConsultaWhatsApp(
  numeroWhatsapp: unknown,
  items: ItemCarrito[],
): string | null {
  const numero = obtenerNumeroWhatsappValido(numeroWhatsapp);
  const mensaje = generarMensajeConsultaWhatsApp(items);

  if (!numero || !mensaje) return null;

  return `${URL_WHATSAPP}/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function crearUrlWhatsappGeneral(
  numeroWhatsapp: unknown,
): string | null {
  const numero = obtenerNumeroWhatsappValido(numeroWhatsapp);
  return numero ? `${URL_WHATSAPP}/${numero}` : null;
}
