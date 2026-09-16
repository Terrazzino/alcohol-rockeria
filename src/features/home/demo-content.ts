import type { ProductCardProps } from "@/components/product-card";

// Contenido exclusivamente visual de Fase 1. No representa entidades de dominio
// ni reemplaza el seed o la capa de datos que se incorporarán en fases posteriores.
export const demoCategories = ["Remeras", "Gorras", "Accesorios"] as const;

export const demoBands = ["Metallica", "Motörhead", "La Renga"] as const;

export const demoProducts: ReadonlyArray<ProductCardProps> = [
  {
    name: "Remera clásica",
    band: "Metallica",
    price: "$ 25.000",
    imageSrc: "/branding/alcohol-rockeria-logo.png",
    imageAlt: "Imagen provisoria para remera de rock",
    status: "available",
    featured: true,
    artworkTone: "gold",
  },
  {
    name: "Gorra trucker",
    band: "Motörhead",
    price: "$ 20.000",
    imageSrc: "/branding/alcohol-rockeria-logo.png",
    imageAlt: "Imagen provisoria para gorra de rock",
    status: "available",
    artworkTone: "charcoal",
  },
  {
    name: "Remera estampada",
    band: "La Renga",
    price: "$ 27.500",
    imageSrc: "/branding/alcohol-rockeria-logo.png",
    imageAlt: "Imagen provisoria para remera estampada",
    status: "out-of-stock",
    artworkTone: "cream",
  },
  {
    name: "Parche bordado",
    price: "$ 8.500",
    imageSrc: "/branding/alcohol-rockeria-logo.png",
    imageAlt: "Imagen provisoria para accesorio bordado",
    status: "available",
    artworkTone: "charcoal",
  },
];
