"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { DialogoConfirmacion } from "@/components/admin/dialogo-confirmacion";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import {
  CANTIDAD_MAXIMA_ITEM_CARRITO,
  calcularSubtotalItemCarrito,
  calcularTotalCarrito,
  centavosAPrecioCarrito,
  obtenerClaveItemCarrito,
  type ItemCarrito,
} from "@/domain/carrito";
import { formatearPrecioArgentino } from "@/domain/productos";
import { crearUrlConsultaWhatsApp } from "@/domain/whatsapp";

import { useCarrito } from "./proveedor-carrito";

function MiniaturaItem({ item }: { item: ItemCarrito }) {
  if (!item.imagen) {
    return (
      <div
        role="img"
        aria-label={`${item.nombre} no tiene imagen guardada`}
        className="flex aspect-square items-center justify-center rounded-sm border border-border bg-background-secondary font-display text-2xl font-bold text-border-strong"
      >
        AR
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-sm border border-border bg-background-secondary">
      <Image
        src={item.imagen.rutaImagen}
        alt={item.imagen.textoAlternativo}
        fill
        sizes="(max-width: 639px) 28vw, 8rem"
        className="object-contain p-2"
      />
    </div>
  );
}

function LineaCarrito({
  item,
  alSolicitarEliminar,
}: {
  item: ItemCarrito;
  alSolicitarEliminar: (item: ItemCarrito) => void;
}) {
  const { actualizarCantidad } = useCarrito();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const clave = obtenerClaveItemCarrito(item);

  function actualizar(cantidad: number) {
    const resultado = actualizarCantidad(clave, cantidad);
    setMensaje(resultado.exito ? null : resultado.mensaje);
  }

  function enviarCantidad(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    actualizar(Number(datos.get("cantidad")));
  }

  return (
    <li>
      <Card>
        <CardContent className="grid min-w-0 gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <MiniaturaItem item={item} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/productos/${item.slug}`}
                  className="break-words font-display text-xl font-bold uppercase tracking-wide text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.nombre}
                </Link>
                {item.variante && (
                  <p className="mt-1 text-sm text-foreground-secondary">
                    Variante: {item.variante.nombre}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => alSolicitarEliminar(item)}
              >
                Eliminar
              </Button>
            </div>

            <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-[minmax(13rem,1fr)_auto] sm:items-end">
              <form onSubmit={enviarCantidad} className="grid gap-2">
                <Input
                  key={item.cantidad}
                  id={`cantidad-${clave}`}
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  inputMode="numeric"
                  defaultValue={item.cantidad}
                  min={1}
                  max={CANTIDAD_MAXIMA_ITEM_CARRITO}
                  step={1}
                  error={mensaje ?? undefined}
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={item.cantidad <= 1}
                    onClick={() => actualizar(item.cantidad - 1)}
                    aria-label={`Disminuir cantidad de ${item.nombre}`}
                  >
                    −
                  </Button>
                  <Button type="submit" size="sm" variant="secondary">
                    Actualizar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={item.cantidad >= CANTIDAD_MAXIMA_ITEM_CARRITO}
                    onClick={() => actualizar(item.cantidad + 1)}
                    aria-label={`Aumentar cantidad de ${item.nombre}`}
                  >
                    +
                  </Button>
                </div>
              </form>

              <div className="sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                  Precio guardado
                </p>
                <p className="mt-1 font-semibold tabular-nums text-foreground-secondary">
                  {formatearPrecioArgentino(item.precioUnitario)} c/u
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                  Subtotal informativo
                </p>
                <p className="mt-1 text-xl font-black tabular-nums text-accent">
                  {formatearPrecioArgentino(
                    centavosAPrecioCarrito(calcularSubtotalItemCarrito(item)),
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}

type ConfirmacionCarrito =
  { tipo: "item"; clave: string; nombre: string } | { tipo: "todo" } | null;

export function VistaCarrito({
  numeroWhatsapp,
}: {
  numeroWhatsapp: string | null;
}) {
  const {
    cantidadUnidades,
    eliminar,
    hidratado,
    items,
    persistenciaDisponible,
    vaciar,
  } = useCarrito();
  const [confirmacion, setConfirmacion] = useState<ConfirmacionCarrito>(null);

  if (!hidratado) {
    return (
      <main id="contenido-principal" className="flex-1 py-14 sm:py-18">
        <Container>
          <LoadingState label="Cargando el carrito" />
        </Container>
      </main>
    );
  }

  const total = formatearPrecioArgentino(
    centavosAPrecioCarrito(calcularTotalCarrito(items)),
  );
  const urlWhatsapp = crearUrlConsultaWhatsApp(numeroWhatsapp, items);

  return (
    <main id="contenido-principal" className="flex-1 py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Selección temporal</p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none tracking-wide sm:text-5xl">
              Carrito de consulta
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">
              Prepará los productos que querés consultar. Este carrito no cobra,
              no reserva stock y no genera un pedido.
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmacion({ tipo: "todo" })}
            >
              Vaciar carrito
            </Button>
          )}
        </div>

        {!persistenciaDisponible && (
          <p
            role="status"
            className="mt-6 rounded-sm border border-error/40 bg-error-soft p-3 text-sm text-error-light"
          >
            El navegador no permite guardar el carrito. La selección seguirá
            disponible solamente durante esta visita.
          </p>
        )}

        {items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Tu carrito está vacío"
              description="Explorá el catálogo y agregá los productos que quieras consultar."
              action={
                <Link href="/#productos" className={buttonStyles()}>
                  Ver productos
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <ul className="grid min-w-0 gap-4">
              {items.map((item) => (
                <LineaCarrito
                  key={obtenerClaveItemCarrito(item)}
                  item={item}
                  alSolicitarEliminar={(seleccion) =>
                    setConfirmacion({
                      tipo: "item",
                      clave: obtenerClaveItemCarrito(seleccion),
                      nombre: seleccion.variante
                        ? `${seleccion.nombre} / ${seleccion.variante.nombre}`
                        : seleccion.nombre,
                    })
                  }
                />
              ))}
            </ul>

            <aside className="rounded-sm border border-border bg-surface p-5 shadow-card lg:sticky lg:top-24">
              <p className="eyebrow">Resumen</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground-secondary">Combinaciones</dt>
                  <dd className="font-semibold tabular-nums">{items.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground-secondary">Unidades</dt>
                  <dd className="font-semibold tabular-nums">
                    {cantidadUnidades}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-4">
                  <dt className="font-bold">Total informativo</dt>
                  <dd className="text-xl font-black tabular-nums text-accent">
                    {total}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-5 text-muted">
                Los precios son la referencia guardada al agregar cada producto
                y pueden haber cambiado. Precio y disponibilidad se confirmarán
                al realizar la consulta.
              </p>
              {urlWhatsapp ? (
                <a
                  href={urlWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles({ className: "mt-5 w-full" })}
                >
                  Consultar por WhatsApp
                </a>
              ) : (
                <>
                  <Button className="mt-5 w-full" disabled>
                    WhatsApp no disponible
                  </Button>
                  <p
                    role="status"
                    className="mt-2 text-center text-xs text-muted"
                  >
                    El número de contacto no está configurado correctamente.
                    Podés conservar el carrito e intentarlo más tarde.
                  </p>
                </>
              )}
            </aside>
          </div>
        )}

        <DialogoConfirmacion
          abierto={confirmacion !== null}
          titulo={
            confirmacion?.tipo === "todo"
              ? "¿Vaciar el carrito?"
              : "¿Eliminar esta selección?"
          }
          descripcion={
            confirmacion?.tipo === "todo"
              ? "Se eliminarán todos los productos preparados para consultar."
              : confirmacion?.tipo === "item"
                ? `Se quitará “${confirmacion.nombre}” del carrito.`
                : ""
          }
          textoConfirmar={
            confirmacion?.tipo === "todo" ? "Vaciar carrito" : "Eliminar"
          }
          alCancelar={() => setConfirmacion(null)}
          alConfirmar={() => {
            if (confirmacion?.tipo === "todo") vaciar();
            if (confirmacion?.tipo === "item") eliminar(confirmacion.clave);
            setConfirmacion(null);
          }}
        />
      </Container>
    </main>
  );
}
