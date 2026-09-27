# Alcohol Rockería

Base web mobile-first para el catálogo administrable de Alcohol Rockería. El MVP permitirá explorar productos y preparar una consulta por WhatsApp; no procesará pagos ni incluirá Mercado Pago.

El desarrollo se organiza estrictamente por las fases definidas en [`docs/roadmap.md`](docs/roadmap.md). Los requisitos funcionales completos están en [`docs/spec.md`](docs/spec.md) y las reglas de trabajo en [`AGENTS.md`](AGENTS.md).

## Estado

Fase 10: gestión de precios completa. El panel protegido permite editar precios individuales y preparar actualizaciones porcentuales masivas por todos los productos, categoría, banda o selección manual, con preview y confirmación antes de una persistencia atómica. Los módulos posteriores, desde configuración del comercio, continúan pendientes de sus fases.

## Stack

- Next.js con App Router
- React
- TypeScript estricto
- Tailwind CSS
- Prisma ORM
- PostgreSQL en Neon
- Auth.js con credenciales
- Vercel Blob para imágenes de producto
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
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_reemplazar"
```

`DATABASE_URL` es la conexión agrupada que utiliza la aplicación. `DIRECT_URL` evita el pooler durante migraciones. `AUTH_SECRET` firma y cifra las sesiones; puede generarse con `npx auth secret`. `BLOB_READ_WRITE_TOKEN` se obtiene al conectar al proyecto un Blob store público desde Vercel Storage. Todas son variables exclusivas del servidor y nunca deben usar el prefijo `NEXT_PUBLIC_`.

## Imágenes de producto

Cada imagen se asocia a un producto y se persiste como archivo público en Vercel Blob, mientras que su URL, texto alternativo, orden y estado principal se guardan en PostgreSQL. Se aceptan JPEG, PNG, WebP y AVIF de hasta 4 MB. La primera imagen de un producto se vuelve principal automáticamente y la base de datos garantiza que no exista más de una principal por producto.

Para desarrollo local, crear el Blob store en Vercel, conectarlo al proyecto y copiar su `BLOB_READ_WRITE_TOKEN` a `.env.local`. No se agregaron cambios al schema Prisma ni migraciones en esta fase: el modelo `ImagenProducto` y el índice único parcial necesario ya formaban parte del modelo inicial.

## Gestión de precios

La ruta protegida `/admin/precios` centraliza el acceso a la edición individual y permite aplicar aumentos o disminuciones porcentuales a todos los productos, una categoría, una banda o una selección manual. Los productos ocultos se excluyen por defecto y sólo se modifican si el administrador lo indica expresamente.

La actualización masiva modifica el precio base y los precios específicos de las variantes incluidas. Las variantes sin precio propio continúan heredando el precio base. El porcentaje admite punto o coma y hasta dos decimales, entre `-100 %` y `10.000 %`, excluyendo `0 %`.

Los cálculos se realizan con centavos enteros y centésimas de punto porcentual. El resultado se redondea al centavo más cercano y, ante un empate exacto, hacia arriba. Antes de persistir se muestra un preview completo; al confirmar, Prisma vuelve a comprobar el estado y los precios y aplica todos los cambios dentro de una transacción serializable. No se agregaron cambios al schema Prisma ni migraciones en esta fase.

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
