import { createBrowserClient } from "@supabase/ssr";

import { obtenerConfiguracionSupabase } from "@/lib/supabase/configuracion";
import type { BaseDeDatos } from "@/lib/supabase/tipos";

export function crearClienteSupabase() {
  const { clavePublica, url } = obtenerConfiguracionSupabase();

  return createBrowserClient<BaseDeDatos>(url, clavePublica);
}
