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

# Fase 5 — CRUD Categorías

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

# Fase 6 — CRUD Bandas

## Entregables

- listado;
- crear;
- editar;
- eliminar;
- ocultar/mostrar;
- ordenar.

---

# Fase 7 — CRUD Productos

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

# Fase 8 — CRUD Variantes

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

# Fase 9 — Gestión de imágenes

## Entregables

- upload;
- preview;
- eliminación;
- principal;
- orden;
- alt text;
- optimización.

El proveedor de almacenamiento se definirá en esta fase.

---

# Fase 10 — Gestión de precios

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

# Fase 11 — Configuración del comercio

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

# Fase 12 — Catálogo público conectado a datos reales

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

---

# Fase 13 — Búsqueda y filtros

## Entregables

- búsqueda;
- filtro por categoría;
- filtro por banda;
- filtro por disponibilidad;
- estado en URL cuando sea conveniente;
- experiencia mobile clara.

---

# Fase 14 — Detalle de producto

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

# Fase 15 — Carrito de consulta

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

---

# Fase 16 — WhatsApp

## Entregables

- mensaje estructurado;
- productos, variantes, cantidades y subtotales;
- total informativo;
- apertura segura de WhatsApp.

---

# Fase 17 — Home final

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

# Fase 18 — QA y optimización

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
