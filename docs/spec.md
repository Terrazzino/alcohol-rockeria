# Especificación de Producto — Alcohol Rockería

## 1. Visión del producto

Alcohol Rockería necesita una presencia web profesional y mobile-first que permita exhibir su catálogo, organizar productos por categoría y banda, facilitar consultas y reducir la dependencia de la visita física al local para conocer mercadería disponible.

La primera versión no será un e-commerce con cobro online.

Será una plataforma de catálogo administrable con:

- navegación pública;
- búsqueda y filtros;
- detalle de productos;
- carrito de consulta;
- envío del carrito por WhatsApp;
- panel administrativo;
- gestión de precios;
- CRUD de las principales entidades.

La arquitectura debe permitir una evolución futura a e-commerce, pero **Mercado Pago queda fuera del alcance actual**.

---

## 2. Objetivos

### Objetivo principal

Permitir que cualquier persona pueda conocer los productos de Alcohol Rockería desde el celular y realizar una consulta organizada por WhatsApp.

### Objetivos secundarios

- Dar visibilidad al catálogo sin necesidad de visitar el local.
- Facilitar la gestión diaria de productos.
- Permitir actualizaciones de precio masivas.
- Organizar la oferta por categorías y bandas.
- Reforzar la identidad histórica y rockera del negocio.
- Dejar una base sólida para futuras funciones de venta online.

---

## 3. Usuarios

### 3.1 Visitante

Puede:

- navegar la home;
- ver productos;
- filtrar;
- buscar;
- entrar al detalle;
- agregar al carrito;
- modificar carrito;
- enviar consulta por WhatsApp;
- acceder a Instagram;
- ver dirección y datos del local.

### 3.2 Administrador

Puede:

- iniciar sesión;
- gestionar productos;
- gestionar categorías;
- gestionar bandas;
- gestionar variantes;
- gestionar imágenes;
- modificar precios;
- aplicar aumentos porcentuales;
- gestionar disponibilidad;
- gestionar destacados;
- modificar configuración del negocio.

---

## 4. Alcance del MVP

Incluido:

- Home
- Catálogo
- Buscador
- Filtro por categoría
- Filtro por banda
- Detalle de producto
- Variantes
- Carrito
- Consulta del carrito por WhatsApp
- Panel administrador
- CRUD de productos
- CRUD de categorías
- CRUD de bandas
- CRUD de variantes cuando corresponda
- CRUD de imágenes de producto
- Gestión de precio
- Actualización masiva porcentual
- Estados de producto
- Productos destacados
- Configuración del comercio
- Mobile-first

No incluido:

- Mercado Pago
- cobro con tarjeta
- conciliación de pagos
- facturación electrónica
- logística automática
- cálculo automático de envíos
- integración con correo
- gestión contable
- ERP
- marketplace
- multi-sucursal

---

## 5. Principio CRUD

Todas las entidades administrables deben implementar CRUD cuando la operación tenga sentido.

Entidades mínimas:

| Entidad | Create | Read | Update | Delete |
|---|---:|---:|---:|---:|
| Categoría | Sí | Sí | Sí | Sí |
| Banda | Sí | Sí | Sí | Sí |
| Producto | Sí | Sí | Sí | Sí |
| Variante | Sí | Sí | Sí | Sí |
| Imagen | Sí | Sí | Sí | Sí |
| Configuración | No necesariamente múltiple | Sí | Sí | No necesariamente |
| Admin | Según fase | Sí | Según permisos | Según permisos |

Las eliminaciones deben ser seguras y evitar inconsistencias.

---

## 6. Modelo conceptual

### Categoria

Campos iniciales:

- id
- nombre
- slug
- descripcion opcional
- url_imagen opcional
- orden
- esta_visible
- creado_en
- actualizado_en

### Banda

Campos iniciales:

- id
- nombre
- slug
- url_imagen opcional
- descripcion opcional
- orden
- esta_visible
- creado_en
- actualizado_en

### Producto

Campos iniciales:

- id
- nombre
- slug
- descripcion
- precio_base
- categoria_id
- banda_id opcional
- estado
- destacado
- orden opcional
- creado_en
- actualizado_en

Estados mínimos:

- ACTIVO
- SIN_STOCK
- OCULTO

### ImagenProducto

- id
- producto_id
- ruta_imagen
- texto_alternativo
- orden
- es_principal
- creado_en

### VarianteProducto

Modelo flexible.

Campos iniciales:

- id
- producto_id
- nombre
- sku opcional
- precio_especifico opcional
- esta_disponible
- orden
- creado_en
- actualizado_en

Ejemplos de `nombre`:

- Talle M
- Talle XL
- Negro / XL
- Estampado premium / L

La implementación puede evolucionar hacia atributos más estructurados si el catálogo lo requiere.

### ConfiguracionTienda

Registro único o configuración equivalente.

Campos:

- nombre_tienda
- titulo_principal
- subtitulo_principal
- numero_whatsapp
- url_instagram
- direccion
- url_maps
- horarios
- texto_historia
- texto_contacto
- actualizado_en

### Administrador

- id
- correo único y normalizado
- hash_contrasena
- nombre opcional
- activo
- creado_en
- actualizado_en

La contraseña original nunca se persiste y no existe registro público.

---

## 7. Reglas de producto

### 7.1 Categorías

- Son dinámicas.
- Se crean desde el admin.
- Pueden ordenarse.
- Pueden ocultarse.
- Los productos deben referenciar una categoría válida.
- No debe existir lógica específica hardcodeada para “Remeras”.

### 7.2 Bandas

- Son dinámicas.
- Se crean desde el admin.
- Son uno de los filtros principales.
- Deben permitir ver “todos los productos de Metallica”, “todos los productos de La Renga”, etc.
- Un producto puede no tener banda asociada.

### 7.3 Productos

Cada producto debe permitir:

- título;
- descripción;
- precio;
- categoría;
- banda opcional;
- varias imágenes;
- variantes;
- estado;
- destacado.

### 7.4 Productos sin stock

Un producto `SIN_STOCK`:

- puede seguir siendo visible;
- debe mostrar claramente “Sin stock”;
- no debería poder agregarse al carrito salvo decisión futura.

Un producto `OCULTO`:

- no aparece públicamente.

### 7.5 Productos destacados

El administrador puede marcar o desmarcar un producto como destacado.

La home puede mostrar una sección “Destacados”.

---

## 8. Precios

### 8.1 Edición individual

El administrador puede editar manualmente el precio de cualquier producto.

### 8.2 Precio por variante

Una variante puede tener:

- el mismo precio base; o
- un precio particular mediante `precio_especifico`.

### 8.3 Actualización masiva

Debe existir una herramienta para aplicar un porcentaje de variación.

Debe aceptar decimales.

Ejemplos:

- 1%
- 1.6%
- 5.8%
- 10%

Debe poder aplicarse a:

- todos los productos;
- una categoría;
- una banda;
- productos seleccionados.

### 8.4 Preview obligatorio

Antes de confirmar:

| Producto | Precio actual | Nuevo precio |
|---|---:|---:|
| Remera Metallica | $25.000 | $26.450 |
| Gorra Motörhead | $20.000 | $21.160 |

El administrador confirma recién luego de revisar.

### 8.5 Redondeo

El sistema debe dejar preparada una estrategia de redondeo configurable o desacoplada.

Para el MVP puede definirse una regla simple, documentada y consistente.

---

## 9. Carrito

El carrito forma parte del MVP.

### Funcionalidades

- agregar producto;
- seleccionar variante;
- seleccionar cantidad;
- incrementar cantidad;
- disminuir cantidad;
- eliminar ítem;
- vaciar carrito;
- mostrar subtotal por ítem;
- mostrar total;
- persistir temporalmente en cliente;
- generar consulta por WhatsApp.

### Restricciones

- No cobra.
- No reserva stock.
- No crea una venta confirmada.
- El total es informativo.

---

## 10. WhatsApp

### Caso principal

El usuario arma:

- 1 Remera Metallica — Talle L
- 1 Gorra Motörhead
- 2 Remeras La Renga — Talle XL

Luego toca:

**Consultar por WhatsApp**

### Mensaje esperado

Ejemplo:

Hola! Quiero consultar por estos productos de Alcohol Rockería:

1 x Remera Metallica
Variante: Talle L
Precio: $25.000

1 x Gorra Motörhead
Precio: $18.000

2 x Remera La Renga
Variante: Talle XL
Precio unitario: $26.000
Subtotal: $52.000

Total informativo: $95.000

¿Tienen disponibilidad?

El texto exacto puede mejorarse, pero debe ser legible y útil para el comercio.

---

## 11. Búsqueda y filtros

### Búsqueda

Debe buscar por:

- nombre de producto;
- banda;
- categoría;
- texto relevante cuando sea útil.

### Filtros mínimos

- categoría;
- banda;
- disponibilidad;
- destacados opcional.

### Orden

Opcional para MVP, recomendado:

- más recientes;
- menor precio;
- mayor precio;
- nombre.

---

## 12. Home

Secciones sugeridas:

1. Hero
2. Categorías
3. Bandas
4. Productos destacados
5. “36 años junto al Rock”
6. Información del local
7. Contacto
8. Instagram / WhatsApp

El orden definitivo puede ajustarse por UX.

---

## 13. Catálogo

Mobile-first.

Cada card debe mostrar como mínimo:

- imagen;
- nombre;
- banda cuando exista;
- precio;
- estado;
- acción de detalle.

Opcional:
- botón rápido de carrito.

---

## 14. Detalle de producto

Debe mostrar:

- galería;
- nombre;
- banda;
- categoría;
- descripción;
- precio;
- variantes;
- disponibilidad;
- selector de cantidad;
- agregar al carrito;
- consultar individualmente por WhatsApp;
- productos relacionados opcionales.

---

## 15. Admin

Rutas protegidas.

Secciones mínimas:

- Dashboard
- Productos
- Categorías
- Bandas
- Precios
- Configuración

### Productos

- listar;
- crear;
- editar;
- eliminar;
- ocultar;
- cambiar estado;
- gestionar imágenes;
- gestionar variantes;
- marcar destacado.

### Categorías

CRUD completo.

### Bandas

CRUD completo.

### Precios

- cambio manual;
- cambio masivo porcentual;
- preview;
- confirmación.

---

## 16. Carga inicial de contenido

No se utilizarán seed ni datos demo automáticos. Categorías, bandas, productos, variantes e imágenes se cargarán manualmente desde el panel administrativo para validar sus CRUD reales.

El primer administrador se crea exclusivamente mediante la herramienta de consola documentada. No existe registro público.

---

## 17. Diseño

### Identidad

- Negro dominante.
- Amarillo/dorado como acento.
- Blanco/gris para soporte.
- Estética rockera, vintage y sobria.
- Uso controlado de texturas.
- Jerarquía clara.
- Tipografía de display para títulos y tipografía legible para cuerpo.

### Mobile-first

Prioridad:

1. 360–430 px
2. 768 px
3. 1024 px+
4. desktop amplio

La experiencia móvil es la referencia principal.

---

## 18. Seguridad

- Auth.js con credenciales para autenticación administrativa.
- Rutas admin protegidas.
- Validaciones del lado servidor donde corresponda.
- Acceso a PostgreSQL exclusivamente desde el servidor mediante Prisma.
- No exponer claves privadas.
- No confiar en roles enviados por el cliente.
- No almacenar contraseñas en texto plano.
- Hashear contraseñas con bcrypt antes de persistirlas.
- Bloquear el acceso de administradores inactivos.

---

## 19. Rendimiento

- Optimización de imágenes.
- Lazy loading donde corresponda.
- Evitar efectos costosos.
- Buen rendimiento en redes móviles.
- No bloquear la carga con recursos secundarios.

---

## 20. Criterios de aceptación del MVP

El MVP se considera funcional si:

1. Un visitante puede navegar desde celular sin errores visuales importantes.
2. Puede filtrar por categoría.
3. Puede filtrar por banda.
4. Puede buscar productos.
5. Puede entrar al detalle.
6. Puede seleccionar variante.
7. Puede agregar al carrito.
8. Puede modificar cantidades.
9. Puede enviar el carrito por WhatsApp.
10. Un admin puede iniciar sesión.
11. Puede crear, leer, modificar y eliminar productos.
12. Puede crear, leer, modificar y eliminar categorías.
13. Puede crear, leer, modificar y eliminar bandas.
14. Puede gestionar imágenes.
15. Puede modificar precios manualmente.
16. Puede aplicar actualización masiva porcentual.
17. Puede ver preview antes de confirmar.
18. Puede cambiar disponibilidad.
19. Puede marcar destacados.
20. Puede editar la configuración principal del comercio.
21. Los datos comerciales pueden cargarse manualmente desde el panel.
22. No existe integración con Mercado Pago.

---

## 21. Evolución futura

Posibles fases futuras:

- stock real por variante;
- reserva de stock;
- pedidos persistidos;
- cuenta de cliente;
- historial;
- Mercado Pago;
- medios de envío;
- promociones;
- cupones;
- analytics;
- SEO más avanzado;
- panel de métricas;
- notificaciones;
- venta online completa.

Estas funciones no deben condicionar excesivamente el MVP.
