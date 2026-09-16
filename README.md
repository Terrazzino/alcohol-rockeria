# Alcohol Rockería

Base web mobile-first para el catálogo administrable de Alcohol Rockería. El MVP permitirá explorar productos y preparar una consulta por WhatsApp; no procesará pagos ni incluirá Mercado Pago.

El desarrollo se organiza estrictamente por las fases definidas en [`docs/roadmap.md`](docs/roadmap.md). Los requisitos funcionales completos están en [`docs/spec.md`](docs/spec.md) y las reglas de trabajo en [`AGENTS.md`](AGENTS.md).

## Estado

Fase 0: inicialización técnica del proyecto. Todavía no hay catálogo, integración con Supabase ni funcionalidades de negocio.

## Stack

- Next.js con App Router
- React
- TypeScript estricto
- Tailwind CSS
- ESLint
- Prettier

Supabase, Vitest y Testing Library se incorporarán en las fases en las que sean necesarios.

## Requisitos

- Node.js 20.9 o superior
- npm

## Puesta en marcha

```bash
npm install
npm run dev
```

Luego se puede abrir [http://localhost:3000](http://localhost:3000).

No se requieren variables de entorno en la Fase 0. El archivo `.env.example` se ampliará cuando se configure Supabase en la Fase 2.

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de produccion
npm run start        # ejecutar el build de produccion
npm run lint         # validar ESLint
npm run typecheck    # validar TypeScript sin emitir archivos
npm run format       # aplicar Prettier
npm run format:check # comprobar formato sin modificar archivos
```

## Estructura inicial

```text
src/
|-- app/         # rutas, layouts y estilos globales del App Router
|-- components/  # componentes reutilizables y sin lógica de negocio
|-- data/        # contratos y acceso a datos
|-- domain/      # tipos y reglas de dominio puras
|-- features/    # modulos funcionales organizados por capacidad
`-- lib/         # utilidades técnicas compartidas
```

Las carpetas están preparadas como límites arquitectónicos; se poblarán en sus fases correspondientes. La integración con Supabase quedará aislada del dominio cuando se implemente en la Fase 2.
