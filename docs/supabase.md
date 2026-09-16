# Supabase — arquitectura y modelo inicial

## Estructura

- `supabase/config.toml`: configuración reproducible del entorno local.
- `supabase/migrations/`: historial versionado del esquema PostgreSQL.
- `src/lib/supabase/cliente.ts`: cliente para Client Components.
- `src/lib/supabase/servidor.ts`: cliente para Server Components, Server Actions y Route Handlers.
- `src/lib/supabase/tipos.ts`: tipos de la base compatibles con el cliente de Supabase.
- `src/domain/modelos.ts`: tipos del dominio desacoplados de PostgreSQL y Supabase.

No se agregó un `proxy.ts` global en esta fase porque todavía no existen rutas autenticadas. La renovación y validación de sesión mediante `getClaims()` se incorporará junto con la autenticación administrativa en la Fase 8, evitando que la home dependa de variables o llamadas de Supabase antes de necesitarlas.

## Desarrollo local

El entorno local requiere Docker y la CLI instalada como dependencia del proyecto.

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:stop
```

No existe seed en esta fase. `db.seed.enabled` permanece desactivado hasta la Fase 3.

Para trabajar contra un proyecto remoto, se debe crear el proyecto en Supabase, copiar `.env.example` como `.env.local`, completar las variables públicas y vincular la CLI:

```bash
npx supabase login
npx supabase link --project-ref ID_DEL_PROYECTO
npx supabase db push
```

`db push` debe ejecutarse solamente después de revisar el proyecto vinculado. No se debe usar `db reset --linked` sobre producción.

## Modelo y relaciones

La migración crea:

- `categorias`
- `bandas`
- `productos`
- `imagenes_producto`
- `variantes_producto`
- `configuracion_tienda`
- `administradores`, como lista mínima de autorización vinculada a `auth.users`

Los identificadores de negocio son UUID. Los precios usan `numeric(12, 2)` para evitar almacenamiento con punto flotante. Los timestamps usan `timestamptz` y los campos `actualizado_en` se mantienen mediante trigger.

Decisiones de borrado:

- una categoría con productos no se puede eliminar (`RESTRICT`);
- al eliminar una banda, sus productos conservan existencia y `banda_id` pasa a `NULL`;
- al eliminar un producto, sus imágenes y variantes se eliminan en cascada;
- sólo puede existir una imagen principal por producto;
- `configuracion_tienda` usa el identificador fijo `1`, por lo que sólo admite un registro.

## Seguridad y RLS

RLS está activo en todas las tablas públicas. Los grants se revocan primero y luego se conceden de forma explícita.

Visitantes anónimos y autenticados pueden leer únicamente:

- categorías y bandas visibles;
- productos que no estén `OCULTO` y pertenezcan a relaciones visibles;
- imágenes y variantes de productos públicamente visibles;
- la configuración de la tienda.

La escritura requiere una sesión autenticada cuyo `auth.uid()` figure activo en `administradores`. Crear el primer usuario y agregarlo a esa tabla es una operación privilegiada que debe realizarse desde Supabase Dashboard, SQL con rol propietario o backend seguro. No existe alta pública de administradores y el registro público local está desactivado.

## Storage

El bucket `imagenes-productos` es público porque almacena material destinado al catálogo. La lectura por URL pública no requiere política; alta, modificación y baja quedan restringidas por RLS a administradores activos.

Restricciones del bucket:

- máximo 5 MiB;
- JPEG, PNG, WebP o AVIF;
- ruta recomendada: `{producto_id}/{uuid}.{extension}`.

La interfaz de upload se implementará en la Fase 12.

## Convención de idioma

El dominio quedó normalizado en español. Como parte de la auditoría se renombraron `ProductCard`, sus props y los mocks visuales a `TarjetaProducto`, `PropiedadesTarjetaProducto` y nombres equivalentes en español. Se conservaron en inglés únicamente APIs impuestas por React, Next.js, Supabase y componentes UI genéricos.
