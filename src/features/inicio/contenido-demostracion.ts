import type { PropiedadesTarjetaProducto } from "@/components/tarjeta-producto";

// Contenido exclusivamente visual de Fase 1. No representa entidades de dominio
// ni reemplaza la carga manual por CRUD ni la futura capa de datos del catálogo.
export const categoriasDemostracion = [
  "Remeras",
  "Gorras",
  "Accesorios",
] as const;

export const bandasDemostracion = [
  "Metallica",
  "Motörhead",
  "La Renga",
] as const;

export const productosDemostracion: ReadonlyArray<PropiedadesTarjetaProducto> =
  [
    {
      nombre: "Remera clásica",
      banda: "Metallica",
      precio: "$ 25.000",
      rutaImagen: "/branding/alcohol-rockeria-logo.png",
      textoAlternativoImagen: "Imagen provisoria para remera de rock",
      estado: "disponible",
      destacado: true,
      tonoVisual: "dorado",
    },
    {
      nombre: "Gorra trucker",
      banda: "Motörhead",
      precio: "$ 20.000",
      rutaImagen: "/branding/alcohol-rockeria-logo.png",
      textoAlternativoImagen: "Imagen provisoria para gorra de rock",
      estado: "disponible",
      tonoVisual: "carbon",
    },
    {
      nombre: "Remera estampada",
      banda: "La Renga",
      precio: "$ 27.500",
      rutaImagen: "/branding/alcohol-rockeria-logo.png",
      textoAlternativoImagen: "Imagen provisoria para remera estampada",
      estado: "sin-stock",
      tonoVisual: "crema",
    },
    {
      nombre: "Parche bordado",
      precio: "$ 8.500",
      rutaImagen: "/branding/alcohol-rockeria-logo.png",
      textoAlternativoImagen: "Imagen provisoria para accesorio bordado",
      estado: "disponible",
      tonoVisual: "carbon",
    },
  ];
