# Alcohol Rockería

Base web mobile-first para el catálogo administrable de Alcohol Rockería. El MVP permitirá explorar productos y preparar una consulta por WhatsApp; no procesará pagos ni incluirá Mercado Pago.

El desarrollo se organiza estrictamente por las fases definidas en [`docs/roadmap.md`](docs/roadmap.md). Los requisitos funcionales completos están en [`docs/spec.md`](docs/spec.md) y las reglas de trabajo en [`AGENTS.md`](AGENTS.md).

## Estado

Fase 2: infraestructura de Supabase y modelo de datos inicial. Todavía no hay seed, catálogo funcional ni panel administrativo.

## Stack

- Next.js con App Router
- React
- TypeScript estricto
- Tailwind CSS
- Supabase (PostgreSQL, Auth y Storage)
- ESLint
- Prettier

Vitest y Testing Library se incorporarán en las fases en las que exista lógica o interacción que probar.

## Requisitos

- Node.js 20.9 o superior
- npm

## Puesta en marcha

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Luego se puede abrir [http://localhost:3000](http://localhost:3000).

Completar en `.env.local` las variables públicas obtenidas en `Project Settings > API` de Supabase:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publica
```

La clave publicable está diseñada para usarse en el cliente junto con RLS. Nunca se debe exponer una clave `service_role`.

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de produccion
npm run start        # ejecutar el build de produccion
npm run lint         # validar ESLint
npm run typecheck    # validar TypeScript sin emitir archivos
npm run format       # aplicar Prettier
npm run format:check # comprobar formato sin modificar archivos
npm run supabase:start # iniciar Supabase local (requiere Docker)
npm run supabase:reset # reconstruir la base local desde migraciones
npm run supabase:test  # ejecutar pruebas SQL/RLS cuando existan
npm run supabase:stop  # detener Supabase local
```

## Estructura inicial

```text
src/
|-- app/         # rutas, layouts y estilos globales del App Router
|-- components/  # componentes reutilizables y sin lógica de negocio
|-- data/        # contratos y acceso a datos
|-- domain/      # tipos y reglas de dominio puras
|-- features/    # modulos funcionales organizados por capacidad
`-- lib/         # utilidades técnicas compartidas e integración con Supabase
```

La integración con Supabase está aislada en `src/lib/supabase`; los tipos propios del negocio permanecen en `src/domain`. El esquema, las decisiones de seguridad y el flujo local están documentados en [`docs/supabase.md`](docs/supabase.md).
