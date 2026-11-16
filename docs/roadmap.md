# Roadmap — Alcohol Rockería

## Objetivo

Construir una primera versión comercialmente presentable, funcional y mantenible sin intentar resolver un e-commerce completo desde el inicio.

---

# Fase 0 — Inicialización

## Objetivos

- Crear repo.
- Inicializar Next.js.
- TypeScript estricto.
- Tailwind.
- ESLint.
- Prettier.
- Configurar estructura base.
- Agregar documentación.
- Preparar variables de entorno.

## Entregables

- proyecto ejecutando localmente;
- `AGENTS.md`;
- `docs/spec.md`;
- `docs/roadmap.md`;
- README básico;
- `.env.example`;
- lint funcionando;
- typecheck funcionando.

---

# Fase 1 — Sistema visual base

## Objetivos

Crear la identidad visual inicial.

## Entregables

- tokens de diseño;
- colores;
- tipografías;
- botones;
- inputs;
- cards;
- layout mobile;
- header;
- footer;
- contenedores;
- estados loading/error/empty.

## Validación

Revisar primero a ~390 px.

---

# Fase 2 — Prisma, PostgreSQL y modelo de datos

## Objetivos

Crear la persistencia inicial con Prisma ORM y PostgreSQL alojado en Neon.

## Tablas

- categorias
- bandas
- productos
- imagenes_producto
- variantes_producto
- configuracion_tienda
- administradores

## Entregables

- configuración Prisma;
- conexión preparada para Neon;
- migraciones SQL versionadas;
- constraints y relaciones;
- tipos generados;
- cliente Prisma reutilizable del lado servidor;
- documentación de desarrollo y despliegue.

---

# Fase 3 — Autenticación administrativa

## Entregables

- Auth.js con credenciales;
- contraseñas hasheadas;
- aprovisionamiento inicial por consola, sin registro público;
- login y logout;
- sesión segura;
- ruta `/admin` protegida;
- bloqueo de administradores inactivos;
- dashboard inicial sin CRUD.

---

# Fase 4 — Base visual del panel administrativo

## Entregables

- layout del panel;
- navegación administrativa mobile-first;
- estados de carga, error y vacío;
- patrones para formularios, tablas y confirmaciones;
- dashboard preparado para los módulos reales.

---

# Fase 5 — CRUD Categorías ✅

**Estado:** completada.

## Entregables

- listado;
- crear;
- editar;
- eliminar;
- ocultar/mostrar;
- ordenar;
- validaciones;
- prevención de borrado inválido.

---

# Fase 6 — CRUD Bandas ✅

**Estado:** completada.

## Entregables

- listado;
- crear;
- editar;
- eliminar;
- ocultar/mostrar;
- ordenar.

---

# Fase 7 — CRUD Productos ✅

**Estado:** completada.

## Entregables

- listar;
- crear;
- editar;
- eliminar;
- estado;
- destacado;
- categoría;
- banda;
- precio;
- descripción;
- slug;
- relaciones con categoría y banda.

---

# Fase 8 — CRUD Variantes ✅

**Estado:** completada.

## Entregables

- listado por producto;
- crear;
- editar;
- eliminar;
- nombre;
- precio opcional;
- disponibilidad;
- orden.

---

# Fase 9 — Gestión de imágenes ✅

**Estado:** completada.

## Entregables

- upload;
- preview;
- eliminación;
- principal;
- orden;
- alt text;
- optimización.

Proveedor definido: Vercel Blob público, integrado del lado servidor. Se validan JPEG, PNG, WebP y AVIF de hasta 4 MB; la primera imagen se define como principal automáticamente y PostgreSQL garantiza una sola principal por producto mediante el índice parcial existente.

---

# Fase 10 — Gestión de precios ✅

**Estado:** completada.

## Objetivos

Resolver uno de los principales casos administrativos.

## Entregables

- edición individual;
- actualización masiva;
- porcentaje decimal;
- filtros de alcance;
- preview;
- confirmación;
- cálculo testeado.

La actualización masiva permite aumentos y disminuciones con hasta dos decimales, aplica a todos los productos, categoría, banda o selección manual y excluye productos ocultos salvo inclusión explícita. El preview incluye precios base y precios específicos de variantes. Los cálculos usan centavos enteros, redondeo al centavo más cercano con empates hacia arriba y persistencia atómica mediante una transacción Prisma serializable.

---

# Fase 11 — Configuración del comercio ✅

**Estado:** completada.

## Entregables

CRUD/edición de:

- nombre;
- WhatsApp;
- Instagram;
- dirección;
- Maps;
- horarios;
- hero;
- textos;
- historia.

La administración protegida permite crear y editar el registro único de configuración con los campos definidos en la especificación. Incluye validación de dominio, normalización del número de WhatsApp, validación de URLs y feedback de guardado. Estos datos aún no se conectan al sitio público.

---

# Fase 12 — Catálogo público conectado a datos reales ✅

**Estado:** completada.

## Objetivos

Construir la navegación pública después de validar la carga manual mediante los CRUD administrativos.

## Entregables

- listado de productos reales;
- cards;
- categorías;
- bandas;
- estados;
- paginación o carga apropiada;
- empty states.

La portada consume categorías y bandas visibles y productos activos o sin stock desde PostgreSQL mediante consultas Prisma del lado servidor. El listado está paginado de a 12 elementos, respeta el orden administrativo, utiliza precios y estados reales y selecciona la imagen principal —o la primera según el orden configurado— con su texto alternativo. Los productos ocultos no se exponen y los casos sin datos, sin imagen o con error tienen estados explícitos. No se conectó todavía la configuración de tienda ni se adelantaron búsqueda, filtros o detalle de producto.

---

# Fase 13 — Búsqueda y filtros ✅

**Estado:** completada.

## Entregables

- búsqueda;
- filtro por categoría;
- filtro por banda;
- filtro por disponibilidad;
- estado en URL cuando sea conveniente;
- experiencia mobile clara.

La búsqueda se ejecuta en PostgreSQL sobre nombre y descripción del producto, categoría y banda. Los filtros públicos por categoría, banda y disponibilidad se combinan como intersección y respetan visibilidad y estado. Los criterios normalizados se representan en la URL, se conservan entre páginas y se restablecen a la primera página al aplicar cambios. La interfaz incluye resumen de criterios, limpieza y un estado vacío específico sin adelantar detalle, carrito ni funciones posteriores.

---

# Fase 14 — Detalle de producto ✅

**Estado:** completada.

## Entregables

- galería;
- descripción;
- precio;
- banda;
- categoría;
- variantes;
- disponibilidad;
- selector de cantidad;
- botón de carrito;
- botón de consulta individual.

La ruta pública `/productos/[slug]` muestra datos reales mediante una consulta Prisma server-side y excluye productos ocultos. Incluye galería ordenada, estado sin imagen, descripción, precio base, relaciones públicas, disponibilidad general y variantes con disponibilidad y precio efectivo propios. Los slugs inválidos, inexistentes u ocultos resuelven con `notFound()`. El selector y las acciones de carrito y consulta se representan deshabilitados, sin adelantar la persistencia del carrito ni la integración con WhatsApp de las fases siguientes.

---

# Fase 15 — Carrito de consulta ✅

**Estado:** completada.

## Objetivos

Permitir armar un pedido sin cobrar.

## Entregables

- agregar al carrito;
- respetar la variante seleccionada;
- modificar cantidades;
- eliminar;
- vaciar;
- persistencia local;
- total informativo.

## Fuera de alcance

- cobro;
- Mercado Pago;
- reserva de stock;
- orden confirmada.

El carrito usa estado React y persistencia local versionada, validada y segura ante datos corruptos. Distingue cada combinación producto/variante, acumula selecciones idénticas y permite modificar cantidades, eliminar, vaciar con confirmación y consultar subtotales y total informativos. Los productos sin stock y las variantes no disponibles no se pueden agregar. Los precios persistidos se tratan como instantáneas no autoritativas y se actualizan al volver a agregar la combinación; la confirmación definitiva queda para la consulta. No se implementó generación de mensajes ni apertura de WhatsApp.

---

# Fase 16 — WhatsApp ✅

**Estado:** completada.

## Entregables

- mensaje estructurado;
- productos, variantes, cantidades y subtotales;
- total informativo;
- apertura segura de WhatsApp.

El carrito genera mediante reglas puras y testeadas un mensaje legible con productos, variantes opcionales, cantidades, precios unitarios y subtotales de referencia, más el total informativo y la aclaración de confirmación comercial. El número se obtiene del registro único de `ConfiguracionTienda` con una consulta server-side limitada al campo necesario y se valida defensivamente. La acción usa `wa.me`, codifica el mensaje una sola vez, abre una pestaña segura y conserva el carrito; si la selección está vacía o la configuración falta o es inválida, no genera enlaces rotos. No se modificaron el schema Prisma, las migraciones ni las dependencias.

---

# Fase 17 — Home final ✅

**Estado:** completada.

## Entregables

- hero;
- categorías;
- bandas;
- destacados;
- trayectoria;
- ubicación;
- redes;
- WhatsApp.

La Home definitiva conserva el catálogo real con búsqueda, filtros y paginación, y suma una portada editorial construida con datos administrados. El hero, la trayectoria, la ubicación, los horarios y el contacto consumen server-side el registro único validado de `ConfiguracionTienda`. Las categorías y bandas visibles respetan el orden administrativo, muestran sus imágenes cuando existen y enlazan a los filtros públicos actuales. Se consultan como máximo cuatro productos destacados en estado `ACTIVO` o `SIN_STOCK`, reutilizando `TarjetaProducto` y las mismas reglas de imagen, precio y estado del catálogo. Instagram, Maps y el WhatsApp general utilizan enlaces externos seguros; el enlace general no genera un carrito ni un mensaje vacío. Todos los bloques contemplan configuración, colecciones e imágenes ausentes sin datos demo. No se modificaron el schema Prisma, las migraciones ni las dependencias.

---

# Fase 18 — QA y optimización

## Estado

Pendiente de cierre. La auditoría de código y las verificaciones automáticas se completaron, y se corrigieron los hallazgos funcionales y de seguridad con solución compatible. La matriz manual sobre navegador, base de prueba y Vercel Blob queda explícitamente pendiente en [`qa-manual.md`](qa-manual.md).

`npm audit` ya no informa vulnerabilidades críticas ni alertas en las dependencias runtime corregibles detectadas. Mantiene alertas altas transitivas en ESLint y Prisma CLI para las que actualmente propone downgrades mayores incompatibles; no se aplicó `--force`. Deben reevaluarse antes del deploy cuando exista una actualización compatible de sus mantenedores.

## Revisiones

- mobile;
- tablet;
- desktop;
- formularios;
- errores;
- empty states;
- links;
- WhatsApp;
- filtros;
- CRUD;
- permisos;
- imágenes;
- performance;
- accesibilidad.

---

# Fase 19 — Deploy

## Entregables

- proyecto en Vercel;
- variables de entorno;
- PostgreSQL/Neon producción;
- dominio;
- HTTPS;
- pruebas finales.

---

# Fuera de alcance actual

No implementar:

- Mercado Pago;
- pago online;
- checkout financiero;
- facturación;
- logística automática;
- multi-sucursal.

---

# Fases futuras

## Futura A — Stock real

- stock por producto;
- stock por variante;
- bloqueo por falta de stock.

## Futura B — Pedidos persistidos

- order;
- order_item;
- historial;
- estados.

## Futura C — Mercado Pago

Solo si el cliente lo solicita.

## Futura D — Envíos

- zonas;
- costos;
- retiro en local;
- transportistas.

---

# Regla de avance

No iniciar una fase si la anterior deja:

- TypeScript roto;
- lint roto;
- tests fallando;
- diseño mobile roto;
- modelo inconsistente;
- CRUD incompleto;
- deuda crítica no documentada.
