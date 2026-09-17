# Alcohol Rockería

Base web mobile-first para el catálogo administrable de Alcohol Rockería. El MVP permitirá explorar productos y preparar una consulta por WhatsApp; no procesará pagos ni incluirá Mercado Pago.

El desarrollo se organiza estrictamente por las fases definidas en [`docs/roadmap.md`](docs/roadmap.md). Los requisitos funcionales completos están en [`docs/spec.md`](docs/spec.md) y las reglas de trabajo en [`AGENTS.md`](AGENTS.md).

## Estado

Fase 8: CRUD de categorías, bandas, productos y variantes completo. El panel protegido permite administrar variantes por producto, disponibilidad, SKU, orden y precios específicos persistidos en Neon mediante Prisma. Imágenes y los demás módulos continúan pendientes de sus fases.

## Stack

- Next.js con App Router
- React
- TypeScript estricto
- Tailwind CSS
- Prisma ORM
- PostgreSQL en Neon
- Auth.js con credenciales
- bcryptjs
- ESLint
- Prettier

Vitest y Testing Library se incorporarán en las fases en las que exista lógica o interacción que probar.

## Requisitos

- Node.js 20.19 o superior
- npm

## Puesta en marcha

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Luego se puede abrir [http://localhost:3000](http://localhost:3000).

Crear `.env.local` a partir de `.env.example` y completar las conexiones obtenidas desde el botón **Connect** del proyecto en Neon:

```dotenv
DATABASE_URL="postgresql://usuario:clave@ep-proyecto-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://usuario:clave@ep-proyecto.region.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="reemplazar-por-un-secreto-seguro"
```

`DATABASE_URL` es la conexión agrupada que utiliza la aplicación. `DIRECT_URL` evita el pooler durante migraciones. `AUTH_SECRET` firma y cifra las sesiones; puede generarse con `npx auth secret`. Todas son variables exclusivas del servidor y nunca deben usar el prefijo `NEXT_PUBLIC_`.

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de produccion
npm run start        # ejecutar el build de produccion
npm run lint         # validar ESLint
npm run typecheck    # validar TypeScript sin emitir archivos
npm run format       # aplicar Prettier
npm run format:check # comprobar formato sin modificar archivos
npm test             # ejecutar tests unitarios con Vitest
npm run db:generate       # generar Prisma Client
npm run db:validate       # validar prisma/schema.prisma
npm run db:migrate        # crear/aplicar una migración de desarrollo
npm run db:migrate:deploy # aplicar migraciones pendientes en deploy
npm run db:studio         # abrir Prisma Studio
npm run admin:crear       # crear un administrador con variables temporales
```

## Primer administrador

No existe registro público ni seed. Para crear un administrador, definir temporalmente `ADMIN_CORREO`, `ADMIN_CONTRASENA` y, opcionalmente, `ADMIN_NOMBRE`, ejecutar `npm run admin:crear` y limpiar esas variables de la terminal. La contraseña debe tener al menos 12 caracteres y nunca se persiste sin hashear.

El flujo completo de autenticación y los ejemplos de consola están documentados en [`docs/autenticacion.md`](docs/autenticacion.md).

## Estructura inicial

```text
src/
|-- app/         # rutas, layouts y estilos globales del App Router
|-- components/  # componentes reutilizables y sin lógica de negocio
|-- data/        # contratos y acceso a datos
|-- domain/      # tipos y reglas de dominio puras
|-- features/    # modulos funcionales organizados por capacidad
`-- lib/         # utilidades técnicas compartidas y cliente Prisma
```

El cliente Prisma vive en `src/lib/prisma.ts`; los tipos propios del negocio permanecen en `src/domain`. El esquema, las relaciones y el flujo con Neon están documentados en [`docs/base-de-datos.md`](docs/base-de-datos.md).
