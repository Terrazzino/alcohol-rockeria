import { describe, expect, it } from "vitest";

import type { ItemCarrito } from "./carrito";
import {
  crearUrlConsultaWhatsApp,
  crearUrlWhatsappGeneral,
  generarMensajeConsultaWhatsApp,
} from "./whatsapp";

const items: ItemCarrito[] = [
  {
    productoId: "11111111-1111-4111-8111-111111111111",
    slug: "remera-metallica",
    nombre: "Remera Metallica",
    variante: {
      id: "22222222-2222-4222-8222-222222222222",
      nombre: "Talle L",
    },
    cantidad: 1,
    precioUnitario: "25000",
    imagen: null,
  },
  {
    productoId: "33333333-3333-4333-8333-333333333333",
    slug: "remera-la-renga",
    nombre: "Remera La Renga",
    variante: null,
    cantidad: 2,
    precioUnitario: "26000.50",
    imagen: null,
  },
];

describe("generarMensajeConsultaWhatsApp", () => {
  it("genera un mensaje estructurado con variantes, precios y totales", () => {
    expect(generarMensajeConsultaWhatsApp(items)).toBe(
      [
        "¡Hola! Quiero consultar por estos productos de Alcohol Rockería:",
        [
          "1 x Remera Metallica",
          "Variante: Talle L",
          "Precio unitario de referencia: $ 25.000",
          "Subtotal de referencia: $ 25.000",
        ].join("\n"),
        [
          "2 x Remera La Renga",
          "Precio unitario de referencia: $ 26.000,50",
          "Subtotal de referencia: $ 52.001",
        ].join("\n"),
        "Total informativo de referencia: $ 77.001",
        "Los precios y la disponibilidad se confirman al realizar la consulta.",
        "¿Tienen disponibilidad?",
      ].join("\n\n"),
    );
  });

  it("no genera una consulta para un carrito vacío", () => {
    expect(generarMensajeConsultaWhatsApp([])).toBeNull();
  });
});

describe("crearUrlWhatsappGeneral", () => {
  it("crea un enlace sin mensaje para el contacto general", () => {
    expect(crearUrlWhatsappGeneral("+54 9 341 555-1234")).toBe(
      "https://wa.me/5493415551234",
    );
    expect(crearUrlWhatsappGeneral("WhatsApp")).toBeNull();
  });
});

describe("crearUrlConsultaWhatsApp", () => {
  it("normaliza el número y codifica el mensaje exactamente una vez", () => {
    const mensaje = generarMensajeConsultaWhatsApp(items);
    const url = crearUrlConsultaWhatsApp("+54 (9) 341-555-1234", items);

    expect(url).not.toBeNull();
    expect(url?.startsWith("https://wa.me/5493415551234?text=")).toBe(true);
    expect(decodeURIComponent(url?.split("?text=")[1] ?? "")).toBe(mensaje);
    expect(url).toContain("%C2%A1Hola!");
    expect(url).not.toContain("%25C2%25A1");
  });

  it("rechaza números ausentes, inválidos o fuera del límite", () => {
    for (const numero of [null, "", "1234567", "54-ROCK", "1".repeat(16)]) {
      expect(crearUrlConsultaWhatsApp(numero, items)).toBeNull();
    }
  });

  it("no construye una URL para un carrito vacío", () => {
    expect(crearUrlConsultaWhatsApp("5493415551234", [])).toBeNull();
  });
});
