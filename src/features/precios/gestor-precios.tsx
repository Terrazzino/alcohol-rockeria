"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import { DialogoConfirmacion } from "@/components/admin/dialogo-confirmacion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  ALCANCES_PRECIOS,
  ETIQUETAS_ALCANCE_PRECIOS,
  formatearPorcentaje,
  type AlcancePrecios,
  type OpcionesGestionPrecios,
  type VistaPreviaPrecios,
} from "@/domain/precios";
import {
  ETIQUETAS_ESTADO_PRODUCTO,
  formatearPrecioArgentino,
} from "@/domain/productos";
import {
  accionConfirmarPrecios,
  accionGenerarPreviewPrecios,
  type EstadoConfirmacionPrecios,
  type EstadoPreviewPrecios,
} from "@/features/precios/acciones";

const estadoPreviewInicial: EstadoPreviewPrecios = {};
const estadoConfirmacionInicial: EstadoConfirmacionPrecios = {};

function FormularioAlcance({
  opciones,
  alObtenerPreview,
}: {
  opciones: OpcionesGestionPrecios;
  alObtenerPreview: (preview: VistaPreviaPrecios) => void;
}) {
  const [alcance, setAlcance] = useState<AlcancePrecios>("TODOS");
  const [incluirOcultos, setIncluirOcultos] = useState(false);
  const [estado, accion, pendiente] = useActionState(
    accionGenerarPreviewPrecios,
    estadoPreviewInicial,
  );

  useEffect(() => {
    if (estado.preview) alObtenerPreview(estado.preview);
  }, [alObtenerPreview, estado.preview]);

  if (estado.preview) return null;

  return (
    <form action={accion} noValidate className="grid gap-6">
      {estado.mensaje ? (
        <p
          role="alert"
          className="rounded-sm border border-error/40 bg-error-soft p-4 text-sm text-error-light"
        >
          {estado.mensaje}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Select
          id="alcance"
          name="alcance"
          label="Alcance"
          value={alcance}
          error={estado.errores?.alcance}
          onChange={(evento) =>
            setAlcance(evento.target.value as AlcancePrecios)
          }
        >
          {ALCANCES_PRECIOS.map((opcion) => (
            <option key={opcion} value={opcion}>
              {ETIQUETAS_ALCANCE_PRECIOS[opcion]}
            </option>
          ))}
        </Select>
        <Input
          id="porcentaje"
          name="porcentaje"
          type="text"
          inputMode="decimal"
          label="Variación porcentual"
          placeholder="Ejemplo: 5,8 o -10"
          hint="Positivo aumenta; negativo disminuye. Hasta 2 decimales."
          error={estado.errores?.porcentaje}
          required
        />
      </div>

      {alcance === "CATEGORIA" ? (
        <Select
          id="referenciaId"
          name="referenciaId"
          label="Categoría"
          defaultValue=""
          error={estado.errores?.referenciaId}
          required
        >
          <option value="" disabled>
            Seleccioná una categoría
          </option>
          {opciones.categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
              {categoria.estaVisible ? "" : " (oculta)"}
            </option>
          ))}
        </Select>
      ) : alcance === "BANDA" ? (
        <Select
          id="referenciaId"
          name="referenciaId"
          label="Banda"
          defaultValue=""
          error={estado.errores?.referenciaId}
          required
        >
          <option value="" disabled>
            Seleccioná una banda
          </option>
          {opciones.bandas.map((banda) => (
            <option key={banda.id} value={banda.id}>
              {banda.nombre}
              {banda.estaVisible ? "" : " (oculta)"}
            </option>
          ))}
        </Select>
      ) : (
        <input type="hidden" name="referenciaId" value="" />
      )}

      {alcance === "SELECCION" ? (
        <fieldset className="rounded-sm border border-border bg-background-secondary p-4">
          <legend className="px-2 text-sm font-semibold">
            Productos seleccionados
          </legend>
          <p className="mb-4 text-sm text-muted">
            Los productos ocultos seleccionados sólo se incluirán si activás la
            opción correspondiente.
          </p>
          <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {opciones.productos.map((producto) => (
              <label
                key={producto.id}
                className="flex cursor-pointer items-start gap-3 rounded-sm border border-border bg-surface p-3 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
              >
                <input
                  type="checkbox"
                  name="productoIds"
                  value={producto.id}
                  className="mt-0.5 size-5 shrink-0 accent-accent"
                />
                <span className="min-w-0">
                  <span className="block break-words font-semibold">
                    {producto.nombre}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {formatearPrecioArgentino(producto.precioBase)} ·{" "}
                    {ETIQUETAS_ESTADO_PRODUCTO[producto.estado]}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {estado.errores?.productoIds ? (
            <p className="mt-3 text-sm text-error">
              {estado.errores.productoIds}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border border-border bg-background-secondary px-4 py-3 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
        <input
          type="checkbox"
          name="incluirOcultos"
          checked={incluirOcultos}
          onChange={(evento) => setIncluirOcultos(evento.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-accent"
        />
        <span>
          <span className="block font-semibold">Incluir productos ocultos</span>
          <span className="mt-1 block text-muted">
            Desactivado por seguridad. El preview identificará cuántos se
            modificarán.
          </span>
        </span>
      </label>

      <Button
        type="submit"
        disabled={pendiente}
        className="sm:justify-self-start"
      >
        {pendiente ? "Calculando…" : "Calcular preview"}
      </Button>
    </form>
  );
}

function TablaPreview({ preview }: { preview: VistaPreviaPrecios }) {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-surface shadow-card">
      <div className="grid gap-4 p-4 md:hidden">
        {preview.productos.map((producto) => (
          <article
            key={producto.id}
            className="rounded-sm border border-border bg-background-secondary p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{producto.nombre}</h3>
                <p className="mt-1 text-xs text-muted">
                  {producto.categoria.nombre} ·{" "}
                  {producto.banda?.nombre ?? "Sin banda"}
                </p>
              </div>
              {producto.estado === "OCULTO" ? <Badge>Oculto</Badge> : null}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Actual
                </dt>
                <dd className="mt-1 font-semibold">
                  {formatearPrecioArgentino(producto.precioActual)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">
                  Resultante
                </dt>
                <dd className="mt-1 font-bold text-accent">
                  {formatearPrecioArgentino(producto.precioResultante)}
                </dd>
              </div>
            </dl>
            {producto.variantes.length ? (
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Precios específicos
                </p>
                <ul className="mt-2 grid gap-2 text-sm">
                  {producto.variantes.map((variante) => (
                    <li
                      key={variante.id}
                      className="flex justify-between gap-3"
                    >
                      <span>{variante.nombre}</span>
                      <span className="text-right">
                        {formatearPrecioArgentino(variante.precioEspecifico)} →{" "}
                        <strong className="text-accent">
                          {formatearPrecioArgentino(variante.precioResultante)}
                        </strong>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead className="bg-surface-raised text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Precio actual</th>
              <th className="px-4 py-3">Precio resultante</th>
              <th className="px-4 py-3">Variantes con precio propio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {preview.productos.map((producto) => (
              <tr key={producto.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-semibold">{producto.nombre}</p>
                  <p className="mt-1 text-xs text-muted">
                    {producto.categoria.nombre} ·{" "}
                    {producto.banda?.nombre ?? "Sin banda"}
                  </p>
                  {producto.estado === "OCULTO" ? (
                    <Badge className="mt-2">Oculto</Badge>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-sm font-semibold">
                  {formatearPrecioArgentino(producto.precioActual)}
                </td>
                <td className="px-4 py-4 text-sm font-bold text-accent">
                  {formatearPrecioArgentino(producto.precioResultante)}
                </td>
                <td className="px-4 py-4 text-sm">
                  {producto.variantes.length === 0 ? (
                    <span className="text-muted">Ninguna</span>
                  ) : (
                    <ul className="grid gap-2">
                      {producto.variantes.map((variante) => (
                        <li key={variante.id}>
                          <span className="font-medium">
                            {variante.nombre}:
                          </span>{" "}
                          {formatearPrecioArgentino(variante.precioEspecifico)}{" "}
                          →{" "}
                          <strong className="text-accent">
                            {formatearPrecioArgentino(
                              variante.precioResultante,
                            )}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConfirmacionPreview({
  preview,
  alModificar,
}: {
  preview: VistaPreviaPrecios;
  alModificar: () => void;
}) {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [estado, accion, pendiente] = useActionState(
    accionConfirmarPrecios.bind(null, preview),
    estadoConfirmacionInicial,
  );
  const cantidad = preview.productos.length;

  return (
    <div className="grid gap-6">
      <section className="rounded-sm border border-accent/40 bg-accent-soft p-4 sm:p-5">
        <p className="eyebrow">Preview listo</p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide">
          {cantidad} {cantidad === 1 ? "producto" : "productos"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground-secondary">
          Variación:{" "}
          {formatearPorcentaje(preview.solicitud.porcentajeCentesimas)}. También
          se actualizarán {preview.cantidadVariantes} precios específicos de
          variantes.
        </p>
        {preview.cantidadOcultos > 0 ? (
          <p className="mt-3 text-sm font-semibold text-accent">
            Incluye {preview.cantidadOcultos}{" "}
            {preview.cantidadOcultos === 1
              ? "producto oculto"
              : "productos ocultos"}
            .
          </p>
        ) : null}
      </section>

      <TablaPreview preview={preview} />

      {estado.mensaje ? (
        <p
          role="alert"
          className="rounded-sm border border-error/40 bg-error-soft p-4 text-sm text-error-light"
        >
          {estado.mensaje}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={alModificar} disabled={pendiente}>
          Modificar selección
        </Button>
        <Button onClick={() => setDialogoAbierto(true)} disabled={pendiente}>
          Confirmar actualización
        </Button>
      </div>

      <form action={accion} className="hidden" id="confirmar-precios" />
      <DialogoConfirmacion
        abierto={dialogoAbierto}
        etiqueta="Actualización masiva"
        varianteConfirmar="primary"
        titulo={`¿Actualizar ${cantidad} ${cantidad === 1 ? "producto" : "productos"}?`}
        descripcion={`Se aplicará ${formatearPorcentaje(preview.solicitud.porcentajeCentesimas)} a ${cantidad} ${cantidad === 1 ? "producto" : "productos"} y a ${preview.cantidadVariantes} precios específicos de variantes. La operación se realizará de forma atómica.`}
        textoConfirmar="Aplicar precios"
        procesando={pendiente}
        mensajeError={estado.mensaje}
        alCancelar={() => setDialogoAbierto(false)}
        alConfirmar={() => {
          const formulario = document.getElementById(
            "confirmar-precios",
          ) as HTMLFormElement | null;
          formulario?.requestSubmit();
        }}
      />
    </div>
  );
}

export function GestorPrecios({
  opciones,
}: {
  opciones: OpcionesGestionPrecios;
}) {
  const [preview, setPreview] = useState<VistaPreviaPrecios | null>(null);
  const [version, setVersion] = useState(0);

  if (preview) {
    return (
      <ConfirmacionPreview
        preview={preview}
        alModificar={() => {
          setPreview(null);
          setVersion((actual) => actual + 1);
        }}
      />
    );
  }

  return (
    <FormularioAlcance
      key={version}
      opciones={opciones}
      alObtenerPreview={setPreview}
    />
  );
}

export function ListadoEdicionIndividual({
  opciones,
}: {
  opciones: OpcionesGestionPrecios;
}) {
  return (
    <section className="mt-10" aria-labelledby="titulo-edicion-individual">
      <div className="mb-4">
        <p className="eyebrow">Edición individual</p>
        <h2
          id="titulo-edicion-individual"
          className="mt-2 font-display text-2xl font-bold uppercase tracking-wide"
        >
          Precios actuales
        </h2>
      </div>
      <div className="grid gap-3">
        {opciones.productos.map((producto) => (
          <article
            key={producto.id}
            className="flex flex-col gap-4 rounded-sm border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className="break-words font-semibold">{producto.nombre}</h3>
              <p className="mt-1 font-bold text-accent">
                {formatearPrecioArgentino(producto.precioBase)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {producto.categoria.nombre} ·{" "}
                {producto.banda?.nombre ?? "Sin banda"} ·{" "}
                {ETIQUETAS_ESTADO_PRODUCTO[producto.estado]}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/productos/${producto.id}/editar`}
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Editar precio base
              </Link>
              <Link
                href={`/admin/productos/${producto.id}/variantes`}
                className={buttonStyles({ variant: "ghost", size: "sm" })}
              >
                Precios de variantes
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
