# Base de datos — Prisma, PostgreSQL y Neon

## Arquitectura

- `prisma/schema.prisma`: modelo fuente de Prisma.
- `prisma/migrations/`: SQL versionado y reproducible.
- `prisma.config.ts`: conexión directa usada por Prisma CLI.
- `src/generated/prisma/`: cliente tipado generado; no se versiona.
- `src/lib/prisma.ts`: instancia reutilizable del cliente para código servidor.
- `src/domain/modelos.ts`: contratos de dominio independientes del ORM.

Prisma Client usa `@prisma/adapter-neon` y la conexión agrupada de `DATABASE_URL`. El cliente se conserva en `globalThis` durante desarrollo para evitar instancias adicionales causadas por hot reload.

No se debe importar `src/lib/prisma.ts` desde Client Components. Las consultas se incorporarán en fases posteriores mediante Server Components, Server Actions o Route Handlers según corresponda.

## Variables de entorno

Neon entrega variantes agrupada y directa de la conexión PostgreSQL:

```dotenv
# Runtime serverless de Next.js
DATABASE_URL="postgresql://usuario:clave@ep-proyecto-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Prisma CLI y migraciones
DIRECT_URL="postgresql://usuario:clave@ep-proyecto.region.aws.neon.tech/neondb?sslmode=require"
```

Ambas variables contienen credenciales. Deben configurarse en `.env.local` y en el proveedor de despliegue, nunca en el repositorio ni en variables `NEXT_PUBLIC_*`.

## Flujo de migraciones

```bash
npm run db:validate
npm run db:generate
npm run db:migrate -- --name nombre_del_cambio
npm run db:migrate:deploy
```

- `db:migrate` se usa en desarrollo y necesita `DIRECT_URL`.
- `db:migrate:deploy` aplica migraciones existentes en integración o producción.
- No existe ni se planifica un seed: los datos comerciales se cargarán manualmente mediante los CRUD administrativos.
- Antes de aplicar migraciones se debe confirmar el proyecto y la rama de Neon seleccionados.

## Modelo y convenciones

Los modelos y propiedades controlados por el negocio están en español y usan camelCase en Prisma. `@map` y `@@map` mantienen tablas y columnas PostgreSQL en español con `snake_case`.

El esquema incluye:

- `Categoria`
- `Banda`
- `Producto`
- `ImagenProducto`
- `VarianteProducto`
- `ConfiguracionTienda`
- `Administrador`
- enum `EstadoProducto`: `ACTIVO`, `SIN_STOCK`, `OCULTO`

Los identificadores son UUID generados por PostgreSQL. Los precios usan `Decimal(12, 2)`; no se persisten como `Float` ni como texto. Los timestamps usan `timestamptz` y Prisma mantiene `actualizadoEn` mediante `@updatedAt`.

## Relaciones y borrado

- Una categoría referenciada por productos no puede eliminarse (`RESTRICT`).
- Al eliminar una banda, `bandaId` pasa a `NULL` (`SET NULL`).
- Al eliminar un producto, imágenes y variantes se eliminan en cascada.
- Un índice parcial garantiza una sola imagen principal por producto.
- Un `CHECK` obliga a que `ConfiguracionTienda.id` sea siempre `1`.
- Slugs, SKU, rutas de imagen y correo administrativo poseen unicidad según corresponda.
- Los campos de orden y precios tienen constraints no negativos en la migración.

La referencia `rutaImagen` puede guardar una URL o ruta futura. El proveedor y la interfaz de upload se definirán en la Fase 12.

## Administración y seguridad

`Administrador` contiene `id`, correo normalizado, `hashContrasena`, nombre opcional, estado activo y timestamps. La contraseña original nunca se almacena. El hash bcrypt tiene un costo de 12 rondas.

Auth.js utiliza sesiones JWT cifradas para identificar al administrador. El acceso protegido vuelve a consultar PostgreSQL para confirmar que el registro sigue activo. No existe registro público; el primer administrador se crea mediante `npm run admin:crear`.

`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` y los hashes deben permanecer exclusivamente del lado servidor. Los detalles operativos están en [`docs/autenticacion.md`](autenticacion.md).
