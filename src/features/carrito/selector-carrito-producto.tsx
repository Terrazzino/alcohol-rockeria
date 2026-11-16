"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CANTIDAD_MAXIMA_ITEM_CARRITO,
  esCantidadCarritoValida,
  type SeleccionCarrito,
} from "@/domain/carrito";
import type { DetalleProductoPublico } from "@/domain/detalle-producto";
import { formatearPrecioArgentino } from "@/domain/productos";
import { crearUrlConsultaWhatsApp } from "@/domain/whatsapp";

import { useCarrito } from "./proveedor-carrito";

export function SelectorCarritoProducto({
  producto,
  numeroWhatsapp,
}: {
  producto: DetalleProductoPublico;
  numeroWhatsapp: string | null;
}) {
  const { agregar, persistenciaDisponible } = useCarrito();
  const [varianteId, setVarianteId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);
  const [procesando, setProcesando] = useState(false);
  const temporizador = useRef<number | null>(null);
  const productoDisponible = producto.estado === "ACTIVO";
  const varianteSeleccionada = producto.variantes.find(
    (variante) => variante.id === varianteId,
  );
  const cantidadNumerica = Number(cantidad);

  function construirSeleccion(): SeleccionCarrito {
    return {
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      variante: varianteSeleccionada
        ? {
            id: varianteSeleccionada.id,
            nombre: varianteSeleccionada.nombre,
          }
        : null,
      precioUnitario: varianteSeleccionada?.precio ?? producto.precioBase,
      imagen: producto.imagenes[0]
        ? {
            rutaImagen: producto.imagenes[0].rutaImagen,
            textoAlternativo: producto.imagenes[0].textoAlternativo,
          }
        : null,
    };
  }

  const seleccionListaParaConsultar =
    productoDisponible &&
    esCantidadCarritoValida(cantidadNumerica) &&
    (producto.variantes.length === 0 ||
      Boolean(varianteSeleccionada?.estaDisponible));
  const urlConsulta = seleccionListaParaConsultar
    ? crearUrlConsultaWhatsApp(numeroWhatsapp, [
        { ...construirSeleccion(), cantidad: cantidadNumerica },
      ])
    : null;

  useEffect(
    () => () => {
      if (temporizador.current !== null) {
        window.clearTimeout(temporizador.current);
      }
    },
    [],
  );

  function agregarSeleccion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (procesando) return;

    if (!productoDisponible) {
      setMensaje({
        tipo: "error",
        texto: "Este producto está sin stock y no puede agregarse al carrito.",
      });
      return;
    }

    if (producto.variantes.length > 0 && !varianteSeleccionada) {
      setMensaje({
        tipo: "error",
        texto: "Seleccioná una variante disponible antes de agregar.",
      });
      return;
    }

    if (varianteSeleccionada && !varianteSeleccionada.estaDisponible) {
      setMensaje({
        tipo: "error",
        texto: "La variante seleccionada no está disponible.",
      });
      return;
    }

    const seleccion = construirSeleccion();

    setProcesando(true);
    const resultado = agregar(seleccion, cantidadNumerica);
    setMensaje({
      tipo: resultado.exito ? "exito" : "error",
      texto: resultado.mensaje,
    });
    temporizador.current = window.setTimeout(() => setProcesando(false), 400);
  }

  return (
    <section aria-labelledby="titulo-seleccion-producto" className="mt-8">
      <form onSubmit={agregarSeleccion} noValidate>
        <fieldset disabled={!productoDisponible || procesando}>
          <legend
            id="titulo-seleccion-producto"
            className="font-display text-2xl font-bold uppercase tracking-wide text-foreground"
          >
            Variantes
          </legend>

          {producto.variantes.length === 0 ? (
            <Card className="mt-4">
              <CardContent>
                <p className="text-sm leading-6 text-foreground-secondary">
                  Este producto no tiene variantes. Podés agregarlo
                  directamente.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {producto.variantes.map((variante) => (
                <label
                  key={variante.id}
                  className={`relative rounded-sm border p-4 transition-colors ${
                    variante.estaDisponible
                      ? "cursor-pointer border-border bg-surface hover:border-accent"
                      : "cursor-not-allowed border-border bg-surface/60 opacity-60"
                  } ${varianteId === variante.id ? "border-accent ring-1 ring-accent" : ""}`}
                >
                  <input
                    type="radio"
                    name="variante"
                    value={variante.id}
                    checked={varianteId === variante.id}
                    onChange={(evento) => {
                      setVarianteId(evento.target.value);
                      setMensaje(null);
                    }}
                    disabled={!variante.estaDisponible}
                    className="absolute right-4 top-4 size-4 accent-accent"
                  />
                  <span className="block pr-7 font-display text-lg font-bold uppercase tracking-wide text-foreground">
                    {variante.nombre}
                  </span>
                  <Badge
                    className="mt-2"
                    variant={variante.estaDisponible ? "success" : "neutral"}
                  >
                    {variante.estaDisponible ? "Disponible" : "No disponible"}
                  </Badge>
                  <span className="mt-3 block font-bold tabular-nums text-accent">
                    {formatearPrecioArgentino(variante.precio)}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {variante.usaPrecioBase
                      ? "Precio base del producto"
                      : "Precio específico"}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-sm border border-border bg-surface p-4 sm:p-5">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">
              Preparar consulta
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">
              Elegí una cantidad y agregá el producto. No se reserva stock ni se
              genera una compra.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[8rem_1fr]">
              <Input
                id="cantidad-producto"
                label="Cantidad"
                type="number"
                inputMode="numeric"
                value={cantidad}
                min={1}
                max={CANTIDAD_MAXIMA_ITEM_CARRITO}
                step={1}
                onChange={(evento) => {
                  setCantidad(evento.target.value);
                  setMensaje(null);
                }}
                required
              />
              <div className="grid gap-3 sm:grid-cols-2 sm:self-end">
                <Button
                  type="submit"
                  disabled={!productoDisponible || procesando}
                >
                  {procesando ? "Agregando…" : "Agregar al carrito"}
                </Button>
                {urlConsulta ? (
                  <a
                    href={urlConsulta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({ variant: "secondary" })}
                  >
                    Consultar producto
                  </a>
                ) : (
                  <Button variant="secondary" disabled>
                    Consultar producto
                  </Button>
                )}
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      {!productoDisponible && (
        <p role="status" className="mt-4 text-sm text-error-light">
          El producto está sin stock y no puede agregarse al carrito.
        </p>
      )}
      {mensaje && (
        <p
          role={mensaje.tipo === "error" ? "alert" : "status"}
          className={`mt-4 rounded-sm border p-3 text-sm ${
            mensaje.tipo === "error"
              ? "border-error/40 bg-error-soft text-error-light"
              : "border-success/40 bg-success-soft text-success"
          }`}
        >
          {mensaje.texto}
        </p>
      )}
      {!persistenciaDisponible && (
        <p role="status" className="mt-3 text-sm text-error-light">
          El carrito funciona durante esta visita, pero el navegador no permite
          guardarlo para más adelante.
        </p>
      )}
      {!numeroWhatsapp && (
        <p role="status" className="mt-3 text-sm text-muted">
          La consulta directa no está disponible hasta que el comercio configure
          su WhatsApp.
        </p>
      )}
    </section>
  );
}
