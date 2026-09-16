export type EstadoProducto = "ACTIVO" | "SIN_STOCK" | "OCULTO";

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  urlImagen: string | null;
  orden: number;
  estaVisible: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Banda {
  id: string;
  nombre: string;
  slug: string;
  urlImagen: string | null;
  descripcion: string | null;
  orden: number;
  estaVisible: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precioBase: number;
  categoriaId: string;
  bandaId: string | null;
  estado: EstadoProducto;
  destacado: boolean;
  orden: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ImagenProducto {
  id: string;
  productoId: string;
  rutaStorage: string;
  textoAlternativo: string;
  orden: number;
  esPrincipal: boolean;
  creadoEn: string;
}

export interface VarianteProducto {
  id: string;
  productoId: string;
  nombre: string;
  sku: string | null;
  precioEspecifico: number | null;
  estaDisponible: boolean;
  orden: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ConfiguracionTienda {
  id: number;
  nombreTienda: string;
  tituloPrincipal: string;
  subtituloPrincipal: string;
  numeroWhatsapp: string;
  urlInstagram: string;
  direccion: string;
  urlMaps: string;
  horarios: string;
  textoHistoria: string;
  textoContacto: string;
  actualizadoEn: string;
}
