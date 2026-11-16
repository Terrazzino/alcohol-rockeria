import { describe, expect, it } from "vitest";

import {
  calcularPaginacionCatalogo,
  crearParametrosUrlCatalogo,
  limitarCriteriosAOpcionesVisibles,
  LONGITUD_MAXIMA_BUSQUEDA_CATALOGO,
  normalizarCriteriosCatalogo,
  normalizarPaginaCatalogo,
  tieneCriteriosCatalogoActivos,
} from "./catalogo-publico";

describe("normalizarCriteriosCatalogo", () => {
  it("normaliza una combinación de búsqueda y filtros", () => {
    expect(
      normalizarCriteriosCatalogo({
        buscar: "  remera   negra  ",
        categoria: " REMERAS ",
        banda: "la-renga",
        disponibilidad: "sin-stock",
        pagina: "3",
      }),
    ).toEqual({
      buscar: "remera negra",
      categoria: "remeras",
      banda: "la-renga",
      disponibilidad: "sin-stock",
      pagina: 3,
    });
  });

  it("convierte una búsqueda vacía y parámetros inválidos al catálogo base", () => {
    expect(
      normalizarCriteriosCatalogo({
        buscar: "   ",
        categoria: "Remeras--Rock",
        banda: "../metallica",
        disponibilidad: "oculto",
        pagina: "-2",
      }),
    ).toEqual({
      buscar: "",
      categoria: null,
      banda: null,
      disponibilidad: null,
      pagina: 1,
    });
  });

  it("toma el primer parámetro repetido y limita búsquedas excesivas", () => {
    const criterios = normalizarCriteriosCatalogo({
      buscar: ["a".repeat(200), "ignorado"],
      categoria: ["remeras", "gorras"],
    });

    expect(criterios.buscar).toHaveLength(LONGITUD_MAXIMA_BUSQUEDA_CATALOGO);
    expect(criterios.categoria).toBe("remeras");
  });
});

describe("criterios públicos disponibles", () => {
  const criterios = normalizarCriteriosCatalogo({
    buscar: "metallica",
    categoria: "oculta",
    banda: "metallica",
    disponibilidad: "disponible",
    pagina: "2",
  });

  it("descarta slugs que no pertenecen a opciones públicas", () => {
    expect(
      limitarCriteriosAOpcionesVisibles(
        criterios,
        [
          {
            id: "1",
            nombre: "Remeras",
            slug: "remeras",
            urlImagen: null,
          },
        ],
        [
          {
            id: "2",
            nombre: "Metallica",
            slug: "metallica",
            urlImagen: null,
          },
        ],
      ),
    ).toEqual({ ...criterios, categoria: null });
  });

  it("serializa filtros activos y preserva la página solicitada", () => {
    const visibles = limitarCriteriosAOpcionesVisibles(
      criterios,
      [],
      [
        {
          id: "2",
          nombre: "Metallica",
          slug: "metallica",
          urlImagen: null,
        },
      ],
    );

    expect(tieneCriteriosCatalogoActivos(visibles)).toBe(true);
    expect(crearParametrosUrlCatalogo(visibles, 4)).toBe(
      "buscar=metallica&banda=metallica&disponibilidad=disponible&pagina=4",
    );
    expect(crearParametrosUrlCatalogo(visibles, 1)).not.toContain("pagina");
  });
});

describe("normalizarPaginaCatalogo", () => {
  it("acepta enteros positivos y toma el primer valor repetido", () => {
    expect(normalizarPaginaCatalogo("3")).toBe(3);
    expect(normalizarPaginaCatalogo(["2", "4"])).toBe(2);
  });

  it("usa la primera página para valores ausentes o inválidos", () => {
    for (const valor of [undefined, "", "0", "-1", "1.5", "texto"]) {
      expect(normalizarPaginaCatalogo(valor)).toBe(1);
    }
  });
});

describe("calcularPaginacionCatalogo", () => {
  it("calcula rangos y navegación", () => {
    expect(calcularPaginacionCatalogo(25, 2, 12)).toEqual({
      paginaActual: 2,
      totalPaginas: 3,
      totalProductos: 25,
      desde: 13,
      hasta: 24,
      hayAnterior: true,
      haySiguiente: true,
    });
  });

  it("limita una página mayor a la última disponible", () => {
    expect(calcularPaginacionCatalogo(13, 99, 12).paginaActual).toBe(2);
  });

  it("representa correctamente un catálogo vacío", () => {
    expect(calcularPaginacionCatalogo(0, 4, 12)).toEqual({
      paginaActual: 1,
      totalPaginas: 0,
      totalProductos: 0,
      desde: 0,
      hasta: 0,
      hayAnterior: false,
      haySiguiente: false,
    });
  });
});
