import type { Metadata } from "next";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { obtenerOpcionesGestionPrecios } from "@/data/precios";
import {
  GestorPrecios,
  ListadoEdicionIndividual,
} from "@/features/precios/gestor-precios";

export const metadata: Metadata = { title: "Precios | Administración" };

interface PaginaPreciosProps {
  searchParams: Promise<{
    resultado?: string | string[];
    cantidad?: string | string[];
  }>;
}

export default async function PaginaPrecios({
  searchParams,
}: PaginaPreciosProps) {
  const [opciones, parametros] = await Promise.all([
    obtenerOpcionesGestionPrecios(),
    searchParams,
  ]);
  const resultado = Array.isArray(parametros.resultado)
    ? parametros.resultado[0]
    : parametros.resultado;
  const cantidadRaw = Array.isArray(parametros.cantidad)
    ? parametros.cantidad[0]
    : parametros.cantidad;
  const cantidad = Number.parseInt(cantidadRaw ?? "", 10);

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Precios"
        descripcion="Actualizá precios individuales o aplicá una variación porcentual con preview y confirmación previa."
        etiqueta="Catálogo"
      />

      {resultado === "actualizados" && Number.isSafeInteger(cantidad) ? (
        <p
          role="status"
          className="mt-6 rounded-sm border border-success/40 bg-success-soft p-4 text-sm text-success"
        >
          Los precios de {cantidad} {cantidad === 1 ? "producto" : "productos"}{" "}
          se actualizaron correctamente.
        </p>
      ) : null}

      <div className="pt-7 sm:pt-8">
        {opciones.productos.length === 0 ? (
          <EstadoVacioAdmin
            titulo="No hay productos para actualizar"
            descripcion="Creá productos antes de utilizar la gestión individual o masiva de precios."
          />
        ) : (
          <>
            <section className="rounded-sm border border-border bg-surface p-4 shadow-card sm:p-6">
              <div className="mb-6">
                <p className="eyebrow">Actualización masiva</p>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide">
                  Preparar variación
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground-secondary">
                  La regla redondea al centavo más cercano; en caso de empate,
                  redondea hacia arriba. Ningún cambio se guarda hasta confirmar
                  el preview.
                </p>
              </div>
              <GestorPrecios opciones={opciones} />
            </section>
            <ListadoEdicionIndividual opciones={opciones} />
          </>
        )}
      </div>
    </>
  );
}
