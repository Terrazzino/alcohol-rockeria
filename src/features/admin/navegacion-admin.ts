export type NombreIconoAdmin =
  | "dashboard"
  | "categorias"
  | "bandas"
  | "productos"
  | "variantes"
  | "imagenes"
  | "precios"
  | "configuracion";

export interface SeccionNavegacionAdmin {
  etiqueta: string;
  href: string;
  icono: NombreIconoAdmin;
  descripcion: string;
}

export const seccionesNavegacionAdmin: readonly SeccionNavegacionAdmin[] = [
  {
    etiqueta: "Dashboard",
    href: "/admin",
    icono: "dashboard",
    descripcion: "Vista general del panel.",
  },
  {
    etiqueta: "Categorías",
    href: "/admin/categorias",
    icono: "categorias",
    descripcion: "Organización principal del catálogo.",
  },
  {
    etiqueta: "Bandas",
    href: "/admin/bandas",
    icono: "bandas",
    descripcion: "Bandas asociadas a los productos.",
  },
  {
    etiqueta: "Productos",
    href: "/admin/productos",
    icono: "productos",
    descripcion: "Información y disponibilidad del catálogo.",
  },
  {
    etiqueta: "Variantes",
    href: "/admin/variantes",
    icono: "variantes",
    descripcion: "Talles, colores y opciones de producto.",
  },
  {
    etiqueta: "Imágenes",
    href: "/admin/imagenes",
    icono: "imagenes",
    descripcion: "Material visual del catálogo.",
  },
  {
    etiqueta: "Precios",
    href: "/admin/precios",
    icono: "precios",
    descripcion: "Edición individual y actualizaciones masivas.",
  },
  {
    etiqueta: "Configuración",
    href: "/admin/configuracion",
    icono: "configuracion",
    descripcion: "Datos públicos del comercio.",
  },
] as const;

export function esRutaAdminActiva(rutaActual: string, href: string) {
  if (href === "/admin") {
    return rutaActual === href;
  }

  return rutaActual === href || rutaActual.startsWith(`${href}/`);
}
