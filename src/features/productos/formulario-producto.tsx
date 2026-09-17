"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ContenedorFormularioAdmin } from "@/components/admin/contenedor-formulario-admin";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ESTADOS_PRODUCTO,
  ETIQUETAS_ESTADO_PRODUCTO,
  type OpcionRelacionProducto,
  type ProductoEditable,
} from "@/domain/productos";
import { generarSlug } from "@/domain/slug";
import {
  accionActualizarProducto,
  accionCrearProducto,
  type EstadoFormularioProducto,
} from "@/features/productos/acciones";

interface FormularioProductoProps {
  producto?: ProductoEditable;
  categorias: OpcionRelacionProducto[];
  bandas: OpcionRelacionProducto[];
}

const estadoInicial: EstadoFormularioProducto = {};

export function FormularioProducto({
  producto,
  categorias,
  bandas,
}: FormularioProductoProps) {
  const accion = producto
    ? accionActualizarProducto.bind(null, producto.id)
    : accionCrearProducto;
  const [estado, ejecutarAccion, pendiente] = useActionState(
    accion,
    estadoInicial,
  );
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [slug, setSlug] = useState(producto?.slug ?? "");
  const [slugPersonalizado, setSlugPersonalizado] = useState(Boolean(producto));

  return (
    <form action={ejecutarAccion} noValidate>
      <ContenedorFormularioAdmin
        titulo={producto ? "Editar producto" : "Nuevo producto"}
        descripcion="Completá la información comercial y las relaciones del producto."
        acciones={
          <>
            <Link
              href="/admin/productos"
              className={buttonStyles({ variant: "secondary" })}
            >
              Cancelar
            </Link>
            <Button type="submit" disabled={pendiente}>
              {pendiente ? "Guardando…" : "Guardar producto"}
            </Button>
          </>
        }
      >
        {estado.mensaje ? (
          <p
            role="alert"
            className="rounded-sm border border-error/40 bg-error-soft p-3 text-sm text-error-light"
          >
            {estado.mensaje}
          </p>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="nombre"
            name="nombre"
            label="Nombre"
            value={nombre}
            onChange={(evento) => {
              const nuevoNombre = evento.target.value;
              setNombre(nuevoNombre);
              if (!slugPersonalizado) setSlug(generarSlug(nuevoNombre));
            }}
            error={estado.errores?.nombre}
            autoComplete="off"
            maxLength={150}
            required
          />
          <Input
            id="slug"
            name="slug"
            label="Slug"
            value={slug}
            onChange={(evento) => {
              setSlug(evento.target.value);
              setSlugPersonalizado(true);
            }}
            error={estado.errores?.slug}
            hint="Identificador legible. Ejemplo: remera-metallica-negra."
            autoComplete="off"
            maxLength={160}
            required
          />
        </div>

        <Textarea
          id="descripcion"
          name="descripcion"
          label="Descripción"
          defaultValue={producto?.descripcion ?? ""}
          error={estado.errores?.descripcion}
          maxLength={5000}
          required
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="precioBase"
            name="precioBase"
            type="text"
            inputMode="decimal"
            label="Precio base"
            defaultValue={producto?.precioBase ?? ""}
            error={estado.errores?.precioBase}
            hint="Usá punto o coma para centavos. Ejemplo: 25000,50."
            placeholder="25000"
            required
          />
          <Input
            id="orden"
            name="orden"
            type="number"
            label="Orden (opcional)"
            defaultValue={producto?.orden ?? ""}
            error={estado.errores?.orden}
            hint="Vacío deja el producto sin orden específico."
            min={0}
            max={999999}
            step={1}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Select
            id="categoriaId"
            name="categoriaId"
            label="Categoría"
            defaultValue={producto?.categoriaId ?? ""}
            error={estado.errores?.categoriaId}
            required
          >
            <option value="" disabled>
              Seleccioná una categoría
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
                {categoria.estaVisible ? "" : " (oculta)"}
              </option>
            ))}
          </Select>
          <Select
            id="bandaId"
            name="bandaId"
            label="Banda (opcional)"
            defaultValue={producto?.bandaId ?? ""}
            error={estado.errores?.bandaId}
          >
            <option value="">Sin banda</option>
            {bandas.map((banda) => (
              <option key={banda.id} value={banda.id}>
                {banda.nombre}
                {banda.estaVisible ? "" : " (oculta)"}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:items-end">
          <Select
            id="estado"
            name="estado"
            label="Estado"
            defaultValue={producto?.estado ?? "ACTIVO"}
            error={estado.errores?.estado}
            required
          >
            {ESTADOS_PRODUCTO.map((estadoProducto) => (
              <option key={estadoProducto} value={estadoProducto}>
                {ETIQUETAS_ESTADO_PRODUCTO[estadoProducto]}
              </option>
            ))}
          </Select>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-border bg-background-secondary px-4 py-3 text-sm font-semibold text-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
            <input
              type="checkbox"
              name="destacado"
              defaultChecked={producto?.destacado ?? false}
              className="size-5 accent-accent"
            />
            Producto destacado
          </label>
        </div>
      </ContenedorFormularioAdmin>
    </form>
  );
}
