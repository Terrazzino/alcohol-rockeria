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

# Fase 2 — Supabase y modelo de datos

## Objetivos

Crear backend inicial.

## Tablas

- categories
- bands
- products
- product_images
- product_variants
- store_settings

## Entregables

- proyecto Supabase;
- migraciones o SQL versionado;
- RLS;
- Storage;
- tipos;
- cliente servidor;
- cliente browser cuando corresponda.

---

# Fase 3 — Seed/demo

## Objetivos

Cargar contenido realista para poder presentar el sitio.

## Datos mínimos

Categorías:
- Remeras
- Gorras
- Accesorios

Bandas:
- Metallica
- Motörhead
- La Renga

Productos:
- mínimo 5

## Entregables

- script o mecanismo reproducible;
- documentación de cómo ejecutar seed;
- datos editables y eliminables desde admin.

---

# Fase 4 — Catálogo público

## Objetivos

Construir la experiencia de navegación.

## Entregables

- listado de productos;
- cards;
- categorías;
- bandas;
- estados;
- paginación o carga apropiada;
- empty states.

---

# Fase 5 — Búsqueda y filtros

## Entregables

- búsqueda;
- filtro por categoría;
- filtro por banda;
- filtro por disponibilidad;
- URL state cuando sea conveniente;
- experiencia mobile clara.

---

# Fase 6 — Detalle de producto

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

---

# Fase 7 — Carrito de consulta

## Objetivos

Permitir armar pedido sin cobrar.

## Entregables

- agregar al carrito;
- modificar cantidades;
- eliminar;
- vaciar;
- persistencia local;
- total informativo;
- integración con WhatsApp;
- mensaje estructurado.

## Fuera de alcance

- cobro;
- Mercado Pago;
- reserva de stock;
- orden confirmada.

---

# Fase 8 — Autenticación admin

## Entregables

- login;
- logout;
- ruta protegida;
- autorización;
- manejo de sesión.

---

# Fase 9 — CRUD Categorías

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

# Fase 10 — CRUD Bandas

## Entregables

- listado;
- crear;
- editar;
- eliminar;
- ocultar/mostrar;
- ordenar.

---

# Fase 11 — CRUD Productos

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
- imágenes;
- variantes.

---

# Fase 12 — Imágenes y Storage

## Entregables

- upload;
- preview;
- eliminación;
- principal;
- orden;
- alt text;
- optimización.

---

# Fase 13 — Variantes

## Entregables

- CRUD variantes;
- nombre;
- precio opcional;
- disponibilidad;
- selector público;
- carrito respetando variante.

---

# Fase 14 — Gestión de precios

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

---

# Fase 15 — Configuración del comercio

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

---

# Fase 16 — Home final

## Entregables

- hero;
- categorías;
- bandas;
- destacados;
- trayectoria;
- ubicación;
- redes;
- WhatsApp.

---

# Fase 17 — QA

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

# Fase 18 — Deploy

## Entregables

- proyecto en Vercel;
- variables de entorno;
- Supabase producción;
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
