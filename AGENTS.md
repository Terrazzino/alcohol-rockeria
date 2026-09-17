# AGENTS.md — Alcohol Rockería

## Propósito

Este archivo define cómo debe trabajar Codex dentro del proyecto **Alcohol Rockería**.

El proyecto es una plataforma web mobile-first para una rockería de Rosario con más de tres décadas de trayectoria. La primera versión debe funcionar como catálogo administrable con carrito de consulta por WhatsApp. Debe quedar preparada para evolucionar en el futuro, pero **Mercado Pago no forma parte del alcance actual**.

---

## Stack obligatorio

- Next.js con App Router
- TypeScript estricto
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Neon
- Auth.js
- Vercel para deploy
- ESLint
- Prettier
- Vitest para lógica testeable
- Testing Library cuando corresponda para componentes

No incorporar otras dependencias importantes sin justificar su necesidad.

---

## Principios de arquitectura

1. **Mobile-first obligatorio.**
   - Diseñar primero para 360–430 px.
   - Después escalar a tablet y desktop.
   - No construir desktop y luego “adaptar”.

2. **Nada importante debe quedar hardcodeado** si pertenece al negocio.
   - Categorías
   - Bandas
   - Productos
   - Precios
   - Datos del local
   - Links sociales
   - Horarios
   - Textos comerciales configurables
   - Estados de producto
   - Productos destacados

3. **CRUD como regla general.**
   Todas las entidades administrables deben permitir, cuando tenga sentido:
   - Create
   - Read
   - Update
   - Delete

4. **Separación de responsabilidades.**
   - UI
   - lógica de dominio
   - acceso a datos
   - validaciones
   - integración con Prisma/PostgreSQL

5. **Evitar lógica de negocio dentro de componentes React.**

6. **Evitar lógica de negocio directamente acoplada a Prisma.**
   Las funciones importantes deben poder testearse sin depender de la base de datos.

7. **No introducir Mercado Pago en el MVP.**
   Puede contemplarse en documentación o diseño futuro, pero no debe implementarse.

8. **El carrito sí forma parte del MVP.**
   El carrito no realiza cobros.
   Su objetivo es generar una consulta estructurada y enviarla por WhatsApp.

---

## Identidad visual

La identidad debe tomar como referencia el logo actual de Alcohol Rockería.

### Lineamientos

- Base oscura, principalmente negro.
- Amarillo/dorado como color de acento.
- Blanco y grises para contraste.
- Estética:
  - rock
  - vintage
  - grunge controlado
  - sobria
  - profesional
- Evitar saturación visual.
- Evitar clichés excesivos: fuego, calaveras, guitarras por todos lados, texturas agresivas en exceso.
- Las fotos de productos deben tener protagonismo.

### Mensajes de marca sugeridos

- “Desde 1990 junto al Rock.”
- “36 años junto al Rock.”
- “La primer rockería de Rosario.”

Los textos definitivos deben quedar configurables si se usan en la web.

---

## Entidades principales

- Administrador
- Categoria
- Banda
- Producto
- ImagenProducto
- VarianteProducto
- ConfiguracionTienda
- ItemCarrito (estado cliente)
- opcional futuro:
  - Pedido
  - ItemPedido
  - Pago

---

## Reglas de dominio clave

### Categorías

- Son dinámicas.
- Nunca deben depender de `if (category === "remeras")`.
- Deben tener CRUD.
- Pueden ordenarse.
- Pueden ocultarse.
- Debe definirse qué ocurre al intentar eliminar una categoría con productos asociados.

### Bandas

- Son dinámicas.
- Deben tener CRUD.
- Deben ser uno de los filtros principales del catálogo.
- Un producto puede estar asociado a una banda o no.
- No hardcodear bandas.

### Productos

Cada producto debe poder tener:

- nombre
- slug
- descripción
- precio base
- categoría
- banda opcional
- imágenes
- destacado
- estado
- orden opcional
- variantes opcionales
- fecha de creación
- fecha de actualización

Estados mínimos:

- ACTIVO
- SIN_STOCK
- OCULTO

### Variantes

Preparar soporte para:

- talle
- color
- tipo de estampado
- precio diferencial
- stock futuro

No asumir que todos los productos tienen las mismas variantes.

### Precios

Debe existir:

1. edición manual por producto;
2. actualización masiva por porcentaje;
3. preview antes de confirmar;
4. soporte para decimales en porcentaje;
5. posibilidad de aplicar a:
   - todos los productos;
   - una categoría;
   - una banda;
   - productos seleccionados.

No modificar productos ocultos o excluidos sin que la interfaz lo deje claro.

### Carrito

El carrito debe:

- permitir agregar productos;
- conservar variante seleccionada;
- permitir cantidad;
- permitir quitar productos;
- permitir modificar cantidades;
- calcular subtotal informativo;
- generar un texto legible;
- abrir WhatsApp con el mensaje prearmado.

No procesa pagos.

### WhatsApp

El mensaje debe contener como mínimo:

- nombre del producto;
- variante/talle si existe;
- cantidad;
- precio mostrado;
- subtotal por ítem;
- total informativo;
- URL o referencia del producto cuando sea útil.

---

## Panel administrativo

El administrador debe poder gestionar:

- productos
- categorías
- bandas
- imágenes
- precios
- variantes
- disponibilidad
- destacados
- configuración del comercio

La experiencia admin debe priorizar claridad y seguridad.

Antes de operaciones masivas o destructivas:
- mostrar confirmación;
- mostrar resumen;
- evitar acciones irreversibles accidentales.

---

## Carga inicial de datos

- No utilizar seed ni datos demo automáticos.
- Categorías, bandas, productos, variantes e imágenes se cargan manualmente desde el panel administrativo.
- El primer administrador se aprovisiona mediante una herramienta de consola segura; esto no es un seed.
- No debe existir registro público de administradores.

---

## Reglas de código

- TypeScript estricto.
- Evitar `any`.
- Preferir tipos explícitos en dominio.
- Componentes pequeños y reutilizables.
- Nombres claros.
- Funciones puras cuando sea posible.
- Manejo de errores explícito.
- No silenciar errores.
- Validar entradas de formularios.
- No confiar en datos provenientes del cliente.
- Mantener seguridad del panel admin con autenticación y autorización reales.
- No almacenar contraseñas en texto plano.
- Verificar en el servidor que el administrador continúe activo antes de operaciones protegidas.

---

## Accesibilidad

- Contraste suficiente.
- Focus visible.
- Botones accesibles.
- Imágenes con `alt`.
- Formularios con labels.
- Navegación usable con teclado cuando corresponda.
- Tamaños táctiles adecuados en mobile.

---

## Rendimiento

- Usar imágenes optimizadas.
- Evitar cargar imágenes innecesariamente.
- Evitar bundles innecesarios.
- Priorizar renderizado rápido en catálogo.
- No sobrecargar la home con efectos.

---

## Flujo de trabajo esperado para Codex

Antes de implementar una tarea:

1. Leer `AGENTS.md`.
2. Leer `docs/spec.md`.
3. Leer `docs/roadmap.md`.
4. Identificar la fase actual.
5. Proponer el mínimo cambio necesario.
6. Implementar.
7. Ejecutar:
   - lint
   - typecheck
   - tests
8. Informar:
   - qué cambió;
   - qué archivos se tocaron;
   - qué falta;
   - si se modificó el esquema de datos.

No avanzar a una fase futura salvo pedido explícito.

---

## Criterio de terminado

Una tarea no está terminada si:

- compila pero rompe mobile;
- agrega lógica hardcodeada;
- no respeta la spec;
- deja errores de TypeScript;
- deja lint fallando;
- rompe tests;
- introduce funcionalidades fuera de alcance;
- implementa Mercado Pago;
- rompe CRUD existente;
- deja operaciones administrativas sin validación básica.
