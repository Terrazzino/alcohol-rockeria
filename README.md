# Alcohol Rockería

Base web mobile-first para el catálogo administrable de Alcohol Rockería. El MVP permitirá explorar productos y preparar una consulta por WhatsApp; no procesará pagos ni incluirá Mercado Pago.

El desarrollo se organiza estrictamente por las fases definidas en [`docs/roadmap.md`](docs/roadmap.md). Los requisitos funcionales completos están en [`docs/spec.md`](docs/spec.md) y las reglas de trabajo en [`AGENTS.md`](AGENTS.md).

## Estado

Fase 18 en validación final. La revisión automatizada y de código está realizada y corrigió validaciones de confianza, estados provisionales del panel, desempates de imágenes, consulta individual por WhatsApp y dependencias runtime vulnerables. Permanecen pendientes la matriz manual documentada y alertas transitivas de tooling sin actualización compatible; la Fase 19 no se inició.

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

Vitest cubre las reglas puras de dominio. Testing Library se reserva para interacciones que requieran pruebas de componentes con DOM.

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

## Configuración del comercio

La ruta protegida `/admin/configuracion` administra el registro único de la tienda. Permite guardar el nombre, título y subtítulo del hero, número de WhatsApp, URL de Instagram, dirección, URL de Maps, horarios, historia y texto de contacto.

El primer guardado crea la configuración con `id = 1`; los siguientes actualizan ese mismo registro mediante `upsert`. WhatsApp se normaliza a dígitos internacionales y las URLs se validan antes de persistir. La Home consume del lado servidor el nombre, título, subtítulo, WhatsApp, Instagram, dirección, Maps, horarios, historia y texto de contacto. El carrito mantiene su consulta mínima del número de WhatsApp. No se agregaron cambios al schema Prisma ni migraciones.

## Home pública

La portada definitiva mantiene el catálogo, su búsqueda, filtros y paginación, y agrega una navegación editorial basada exclusivamente en datos administrados. El hero utiliza la identidad configurada; las categorías y bandas visibles respetan el orden administrativo, muestran su imagen cuando existe y enlazan a los filtros públicos ya implementados.

La sección de destacados consulta hasta cuatro productos marcados como tales y publicados en estado `ACTIVO` o `SIN_STOCK`. Reutiliza las mismas tarjetas, precios, estados y reglas de selección de imagen que el catálogo. La trayectoria, dirección, Maps, horarios, contacto, Instagram y WhatsApp proceden de `ConfiguracionTienda`; los enlaces externos se abren de forma segura y el acceso general a WhatsApp no crea un carrito ni un mensaje ficticio.

Si faltan la configuración, destacados, categorías, bandas o imágenes, se muestran estados vacíos o reemplazos visuales explícitos sin incorporar datos demo. La implementación se mantiene server-side salvo por el carrito ya existente y limita la consulta inicial a cuatro destacados.

## Catálogo público

La portada consulta Prisma exclusivamente del lado servidor y muestra las categorías y bandas con `estaVisible = true`. Los productos públicos son los que están en estado `ACTIVO` o `SIN_STOCK`; los productos `OCULTO` no se consultan ni se exponen. El estado sin stock se identifica expresamente y el indicador de destacado refleja el valor persistido.

El listado usa paginación de 12 productos, respeta el orden administrativo y muestra los precios reales. Para cada producto se selecciona una sola imagen en la consulta, priorizando la principal y luego el orden configurado; se conserva su texto alternativo y se muestra un reemplazo neutro cuando no existe imagen. Los estados sin datos y los errores de lectura tienen feedback propio. No se agregaron cambios al schema Prisma ni migraciones en esta fase.

La búsqueda pública consulta nombre y descripción del producto, nombre de categoría y nombre de banda. Puede combinarse por intersección con filtros de categoría, banda y disponibilidad. Los parámetros `buscar`, `categoria`, `banda`, `disponibilidad` y `pagina` conservan el estado en la URL; las opciones se limitan a clasificaciones visibles y la paginación mantiene todos los criterios activos. No se agregaron cambios al schema Prisma ni migraciones para búsqueda y filtros.

## Detalle público de producto

La ruta dinámica `/productos/[slug]` consulta exclusivamente productos `ACTIVO` o `SIN_STOCK`. Un slug inválido, inexistente o perteneciente a un producto `OCULTO` responde con la página 404 pública sin revelar datos administrativos.

El detalle muestra la galería completa ordenada por imagen principal, orden administrativo y desempates deterministas; conserva el alt text y contempla productos sin imágenes. También muestra descripción, precio base, categoría y banda públicas, estado general y variantes ordenadas. Cada variante diferencia su disponibilidad y usa su precio específico o hereda el precio base cuando corresponde. La cantidad, el agregado al carrito y la consulta individual por WhatsApp respetan la variante y cantidad elegidas. No se agregaron cambios al schema Prisma ni migraciones.

## Carrito de consulta

La ruta `/carrito` permite revisar la selección, modificar cantidades, incrementar o disminuir unidades, eliminar combinaciones y vaciar el carrito con confirmación. El encabezado muestra el total de unidades y el resumen calcula subtotales y total exclusivamente como referencia. Los productos `SIN_STOCK` y las variantes no disponibles no pueden agregarse; cuando un producto tiene variantes, debe seleccionarse una disponible explícitamente.

El carrito se mantiene en React y persiste temporalmente en `localStorage` mediante una estructura versionada y validada antes de utilizarse. Cada línea guarda sólo identificación pública, variante opcional, cantidad, precio efectivo e imagen de presentación. La misma combinación acumula cantidad y variantes distintas generan líneas distintas. Se permiten entre 1 y 99 unidades por combinación y hasta 50 combinaciones.

El precio guardado es una instantánea informativa, no una fuente autoritativa ni una orden: al volver a agregar la misma combinación se actualizan sus datos y precio, y la interfaz advierte que precio y disponibilidad pueden haber cambiado y se confirmarán al consultar. No se crean pedidos, reservas ni checkout. No se agregaron cambios al schema Prisma, migraciones ni dependencias.

## Consulta por WhatsApp

Desde `/carrito`, una acción explícita genera un mensaje con cada producto, su variante cuando existe, cantidad, precio unitario y subtotal de referencia, seguido del total informativo. El texto aclara que precios y disponibilidad deben confirmarse con el comercio.

El carrito y el detalle consultan del lado servidor únicamente `numeroWhatsapp` del registro único de configuración, lo normalizan y validan antes de entregarlo al flujo público. Si el registro falta o el número es inválido, no se construye un enlace y se muestra un estado seguro. La URL oficial `wa.me` codifica el mensaje una sola vez y se abre en una pestaña nueva con protecciones de contexto; abrirla no vacía ni modifica la selección local.

## QA

La revisión automatizada se ejecuta con lint, TypeScript, Vitest, build de producción, Prettier y `git diff --check`. Prisma valida el esquema actual. La lista de recorridos que requieren navegador, datos e integraciones reales está en [`docs/qa-manual.md`](docs/qa-manual.md); sus casillas no representan pruebas ejecutadas.

El parche de Next.js y las actualizaciones transitivas compatibles eliminaron la vulnerabilidad crítica y las alertas runtime detectadas en `next`, `sharp` y `source-map-js`. `npm audit` aún informa alertas altas en cadenas de ESLint y Prisma CLI. Sus correcciones automáticas implican downgrades mayores incompatibles, por lo que quedan documentadas como bloqueo para evaluar cuando los mantenedores publiquen una ruta compatible; no se usó `--force`.

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
