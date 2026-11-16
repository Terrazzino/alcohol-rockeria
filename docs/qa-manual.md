# Checklist de QA manual

Esta lista complementa las verificaciones automáticas de la Fase 18. Ningún ítem se considera aprobado hasta ejecutarlo contra una base PostgreSQL/Neon de prueba y un Blob store de prueba, con datos representativos. Los ítems permanecen deliberadamente sin marcar.

## Matriz responsive y accesibilidad

- [ ] Recorrer Home, catálogo, detalle, carrito, login y cada sección administrativa a 360, 390 y 430 px.
- [ ] Repetir los recorridos a 768 px y 1280 px; comprobar que no haya overflow, solapamientos ni controles inaccesibles.
- [ ] Completar los recorridos principales sólo con teclado; revisar foco visible, orden de tabulación, Escape en diálogos y retorno de foco.
- [ ] Comprobar labels, mensajes anunciados, contraste y textos alternativos con lector de pantalla.

## Panel administrativo

- [ ] Iniciar y cerrar sesión; comprobar rechazo de credenciales inválidas y de un administrador desactivado.
- [ ] Crear, editar, ocultar/mostrar y eliminar categorías y bandas; verificar restricciones cuando tienen productos.
- [ ] Crear, editar, cambiar estado/destacado y eliminar productos; verificar categoría obligatoria y banda opcional.
- [ ] Crear, editar, habilitar/deshabilitar y eliminar variantes, con y sin precio específico.
- [ ] Subir JPEG, PNG, WebP y AVIF válidos; rechazar tipo o tamaño inválido; editar alt/orden, cambiar principal y eliminar con confirmación.
- [ ] Simular error de Blob al subir y eliminar; comprobar feedback y consistencia entre archivo y registro.
- [ ] Previsualizar y confirmar aumentos y disminuciones para todos, categoría, banda y selección; repetir incluyendo y excluyendo ocultos.
- [ ] Cambiar un precio entre preview y confirmación; comprobar que la transacción completa se rechace sin cambios parciales.
- [ ] Crear y editar la configuración única; comprobar nullable, normalización de WhatsApp y URLs inválidas.

## Sitio público y carrito

- [ ] Verificar estados con datos, sin datos y con error de Home y catálogo.
- [ ] Combinar búsqueda, categoría, banda y disponibilidad; comprobar URL, paginación, limpiar filtros y resultado vacío.
- [ ] Abrir productos activos, sin stock, ocultos, inexistentes, sin imagen y con múltiples imágenes/variantes.
- [ ] Agregar productos con y sin variante, modificar cantidades, eliminar y vaciar con confirmación.
- [ ] Recargar y abrir otra pestaña; comprobar persistencia y sincronización del carrito, además del fallback sin `localStorage`.
- [ ] Probar JSON corrupto y una versión de persistencia incompatible; comprobar recuperación con carrito vacío.
- [ ] Abrir la consulta individual y la del carrito en WhatsApp; verificar tildes, símbolos, variantes, cantidades, subtotales y total sin doble codificación.
- [ ] Comprobar comportamiento seguro con carrito vacío o WhatsApp ausente/inválido.

## Integraciones y operación

- [ ] Ejecutar el flujo completo contra PostgreSQL/Neon de prueba y comprobar migraciones pendientes antes del deploy.
- [ ] Ejecutar carga y borrado reales contra Vercel Blob de prueba, incluida una caída simulada del proveedor.
- [ ] Revisar consola del navegador, logs del servidor, enlaces externos y respuestas 404/500 durante todos los recorridos.
- [ ] Medir Home, catálogo y detalle con Lighthouse en mobile; registrar LCP, CLS, INP y oportunidades antes de autorizar deploy.
