import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { obtenerConfiguracionSupabase } from "@/lib/supabase/configuracion";
import type { BaseDeDatos } from "@/lib/supabase/tipos";

export async function crearClienteSupabaseServidor() {
  const almacenCookies = await cookies();
  const { clavePublica, url } = obtenerConfiguracionSupabase();

  return createServerClient<BaseDeDatos>(url, clavePublica, {
    cookies: {
      getAll() {
        return almacenCookies.getAll();
      },
      setAll(cookiesParaGuardar) {
        cookiesParaGuardar.forEach(({ name, options, value }) => {
          almacenCookies.set(name, value, options);
        });
      },
    },
  });
}
