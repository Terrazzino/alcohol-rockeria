-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "estado_producto" AS ENUM ('ACTIVO', 'SIN_STOCK', 'OCULTO');

-- CreateTable
CREATE TABLE "categorias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "url_imagen" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "esta_visible" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bandas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "url_imagen" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "esta_visible" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bandas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio_base" DECIMAL(12,2) NOT NULL,
    "categoria_id" UUID NOT NULL,
    "banda_id" UUID,
    "estado" "estado_producto" NOT NULL DEFAULT 'ACTIVO',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "ruta_imagen" TEXT NOT NULL,
    "texto_alternativo" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variantes_producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "producto_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "sku" TEXT,
    "precio_especifico" DECIMAL(12,2),
    "esta_disponible" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "variantes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_tienda" (
    "id" SMALLINT NOT NULL DEFAULT 1,
    "nombre_tienda" TEXT NOT NULL,
    "titulo_principal" TEXT NOT NULL,
    "subtitulo_principal" TEXT NOT NULL,
    "numero_whatsapp" TEXT NOT NULL,
    "url_instagram" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "url_maps" TEXT NOT NULL,
    "horarios" TEXT NOT NULL,
    "texto_historia" TEXT NOT NULL,
    "texto_contacto" TEXT NOT NULL,
    "actualizado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_tienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administradores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_esta_visible_orden_idx" ON "categorias"("esta_visible", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "bandas_slug_key" ON "bandas"("slug");

-- CreateIndex
CREATE INDEX "bandas_esta_visible_orden_idx" ON "bandas"("esta_visible", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "productos_slug_key" ON "productos"("slug");

-- CreateIndex
CREATE INDEX "productos_categoria_id_idx" ON "productos"("categoria_id");

-- CreateIndex
CREATE INDEX "productos_banda_id_idx" ON "productos"("banda_id");

-- CreateIndex
CREATE INDEX "productos_estado_destacado_idx" ON "productos"("estado", "destacado");

-- CreateIndex
CREATE UNIQUE INDEX "imagenes_producto_ruta_imagen_key" ON "imagenes_producto"("ruta_imagen");

-- CreateIndex
CREATE INDEX "imagenes_producto_producto_id_orden_idx" ON "imagenes_producto"("producto_id", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "variantes_producto_sku_key" ON "variantes_producto"("sku");

-- CreateIndex
CREATE INDEX "variantes_producto_producto_id_orden_idx" ON "variantes_producto"("producto_id", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "administradores_email_key" ON "administradores"("email");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_banda_id_fkey" FOREIGN KEY ("banda_id") REFERENCES "bandas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_producto" ADD CONSTRAINT "imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variantes_producto" ADD CONSTRAINT "variantes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Constraints de dominio no expresables actualmente en Prisma Schema Language.
ALTER TABLE "categorias"
  ADD CONSTRAINT "categorias_nombre_no_vacio" CHECK (char_length(trim("nombre")) > 0),
  ADD CONSTRAINT "categorias_slug_valido" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  ADD CONSTRAINT "categorias_orden_no_negativo" CHECK ("orden" >= 0);

ALTER TABLE "bandas"
  ADD CONSTRAINT "bandas_nombre_no_vacio" CHECK (char_length(trim("nombre")) > 0),
  ADD CONSTRAINT "bandas_slug_valido" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  ADD CONSTRAINT "bandas_orden_no_negativo" CHECK ("orden" >= 0);

ALTER TABLE "productos"
  ADD CONSTRAINT "productos_nombre_no_vacio" CHECK (char_length(trim("nombre")) > 0),
  ADD CONSTRAINT "productos_slug_valido" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  ADD CONSTRAINT "productos_descripcion_no_vacia" CHECK (char_length(trim("descripcion")) > 0),
  ADD CONSTRAINT "productos_precio_no_negativo" CHECK ("precio_base" >= 0),
  ADD CONSTRAINT "productos_orden_no_negativo" CHECK ("orden" IS NULL OR "orden" >= 0);

ALTER TABLE "imagenes_producto"
  ADD CONSTRAINT "imagenes_ruta_no_vacia" CHECK (char_length(trim("ruta_imagen")) > 0),
  ADD CONSTRAINT "imagenes_alt_no_vacio" CHECK (char_length(trim("texto_alternativo")) > 0),
  ADD CONSTRAINT "imagenes_orden_no_negativo" CHECK ("orden" >= 0);

ALTER TABLE "variantes_producto"
  ADD CONSTRAINT "variantes_nombre_no_vacio" CHECK (char_length(trim("nombre")) > 0),
  ADD CONSTRAINT "variantes_sku_no_vacio" CHECK ("sku" IS NULL OR char_length(trim("sku")) > 0),
  ADD CONSTRAINT "variantes_precio_no_negativo" CHECK ("precio_especifico" IS NULL OR "precio_especifico" >= 0),
  ADD CONSTRAINT "variantes_orden_no_negativo" CHECK ("orden" >= 0);

ALTER TABLE "configuracion_tienda"
  ADD CONSTRAINT "configuracion_registro_unico" CHECK ("id" = 1),
  ADD CONSTRAINT "configuracion_nombre_no_vacio" CHECK (char_length(trim("nombre_tienda")) > 0),
  ADD CONSTRAINT "configuracion_titulo_no_vacio" CHECK (char_length(trim("titulo_principal")) > 0),
  ADD CONSTRAINT "configuracion_whatsapp_no_vacio" CHECK (char_length(trim("numero_whatsapp")) > 0),
  ADD CONSTRAINT "configuracion_direccion_no_vacia" CHECK (char_length(trim("direccion")) > 0),
  ADD CONSTRAINT "configuracion_horarios_no_vacios" CHECK (char_length(trim("horarios")) > 0);

ALTER TABLE "administradores"
  ADD CONSTRAINT "administradores_email_no_vacio" CHECK (char_length(trim("email")) > 0),
  ADD CONSTRAINT "administradores_email_minuscula" CHECK ("email" = lower("email"));

CREATE UNIQUE INDEX "imagenes_producto_una_principal"
  ON "imagenes_producto" ("producto_id")
  WHERE "es_principal";
