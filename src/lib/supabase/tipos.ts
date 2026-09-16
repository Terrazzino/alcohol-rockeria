export type Json =
  | string
  | number
  | boolean
  | null
  | { [clave: string]: Json | undefined }
  | Json[];

export interface BaseDeDatos {
  public: {
    Tables: {
      administradores: {
        Row: {
          usuario_id: string;
          activo: boolean;
          creado_en: string;
        };
        Insert: {
          usuario_id: string;
          activo?: boolean;
          creado_en?: string;
        };
        Update: {
          usuario_id?: string;
          activo?: boolean;
          creado_en?: string;
        };
        Relationships: [];
      };
      bandas: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          url_imagen: string | null;
          descripcion: string | null;
          orden: number;
          esta_visible: boolean;
          creado_en: string;
          actualizado_en: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          slug: string;
          url_imagen?: string | null;
          descripcion?: string | null;
          orden?: number;
          esta_visible?: boolean;
          creado_en?: string;
          actualizado_en?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          slug?: string;
          url_imagen?: string | null;
          descripcion?: string | null;
          orden?: number;
          esta_visible?: boolean;
          creado_en?: string;
          actualizado_en?: string;
        };
        Relationships: [];
      };
      categorias: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          descripcion: string | null;
          url_imagen: string | null;
          orden: number;
          esta_visible: boolean;
          creado_en: string;
          actualizado_en: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          slug: string;
          descripcion?: string | null;
          url_imagen?: string | null;
          orden?: number;
          esta_visible?: boolean;
          creado_en?: string;
          actualizado_en?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          slug?: string;
          descripcion?: string | null;
          url_imagen?: string | null;
          orden?: number;
          esta_visible?: boolean;
          creado_en?: string;
          actualizado_en?: string;
        };
        Relationships: [];
      };
      configuracion_tienda: {
        Row: {
          id: number;
          nombre_tienda: string;
          titulo_principal: string;
          subtitulo_principal: string;
          numero_whatsapp: string;
          url_instagram: string;
          direccion: string;
          url_maps: string;
          horarios: string;
          texto_historia: string;
          texto_contacto: string;
          actualizado_en: string;
        };
        Insert: {
          id?: number;
          nombre_tienda: string;
          titulo_principal: string;
          subtitulo_principal: string;
          numero_whatsapp: string;
          url_instagram: string;
          direccion: string;
          url_maps: string;
          horarios: string;
          texto_historia: string;
          texto_contacto: string;
          actualizado_en?: string;
        };
        Update: {
          id?: number;
          nombre_tienda?: string;
          titulo_principal?: string;
          subtitulo_principal?: string;
          numero_whatsapp?: string;
          url_instagram?: string;
          direccion?: string;
          url_maps?: string;
          horarios?: string;
          texto_historia?: string;
          texto_contacto?: string;
          actualizado_en?: string;
        };
        Relationships: [];
      };
      imagenes_producto: {
        Row: {
          id: string;
          producto_id: string;
          ruta_storage: string;
          texto_alternativo: string;
          orden: number;
          es_principal: boolean;
          creado_en: string;
        };
        Insert: {
          id?: string;
          producto_id: string;
          ruta_storage: string;
          texto_alternativo: string;
          orden?: number;
          es_principal?: boolean;
          creado_en?: string;
        };
        Update: {
          id?: string;
          producto_id?: string;
          ruta_storage?: string;
          texto_alternativo?: string;
          orden?: number;
          es_principal?: boolean;
          creado_en?: string;
        };
        Relationships: [
          {
            foreignKeyName: "imagenes_producto_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          },
        ];
      };
      productos: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          descripcion: string;
          precio_base: number;
          categoria_id: string;
          banda_id: string | null;
          estado: BaseDeDatos["public"]["Enums"]["estado_producto"];
          destacado: boolean;
          orden: number | null;
          creado_en: string;
          actualizado_en: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          slug: string;
          descripcion: string;
          precio_base: number;
          categoria_id: string;
          banda_id?: string | null;
          estado?: BaseDeDatos["public"]["Enums"]["estado_producto"];
          destacado?: boolean;
          orden?: number | null;
          creado_en?: string;
          actualizado_en?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          slug?: string;
          descripcion?: string;
          precio_base?: number;
          categoria_id?: string;
          banda_id?: string | null;
          estado?: BaseDeDatos["public"]["Enums"]["estado_producto"];
          destacado?: boolean;
          orden?: number | null;
          creado_en?: string;
          actualizado_en?: string;
        };
        Relationships: [
          {
            foreignKeyName: "productos_banda_id_fkey";
            columns: ["banda_id"];
            isOneToOne: false;
            referencedRelation: "bandas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "productos_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
        ];
      };
      variantes_producto: {
        Row: {
          id: string;
          producto_id: string;
          nombre: string;
          sku: string | null;
          precio_especifico: number | null;
          esta_disponible: boolean;
          orden: number;
          creado_en: string;
          actualizado_en: string;
        };
        Insert: {
          id?: string;
          producto_id: string;
          nombre: string;
          sku?: string | null;
          precio_especifico?: number | null;
          esta_disponible?: boolean;
          orden?: number;
          creado_en?: string;
          actualizado_en?: string;
        };
        Update: {
          id?: string;
          producto_id?: string;
          nombre?: string;
          sku?: string | null;
          precio_especifico?: number | null;
          esta_disponible?: boolean;
          orden?: number;
          creado_en?: string;
          actualizado_en?: string;
        };
        Relationships: [
          {
            foreignKeyName: "variantes_producto_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      es_administrador: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      estado_producto: "ACTIVO" | "SIN_STOCK" | "OCULTO";
    };
    CompositeTypes: Record<never, never>;
  };
}
