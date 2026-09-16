interface ConfiguracionSupabase {
  url: string;
  clavePublica: string;
}

export function obtenerConfiguracionSupabase(): ConfiguracionSupabase {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clavePublica = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !clavePublica) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, clavePublica };
}
