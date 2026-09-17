# Autenticación administrativa

## Alcance

La Fase 3 implementa acceso interno con Auth.js y el proveedor de credenciales. No hay OAuth, registro público, recuperación de contraseña, roles ni CRUD administrativos.

El flujo es:

1. un administrador se aprovisiona desde consola;
2. `/admin/login` valida correo y contraseña del lado servidor;
3. Auth.js crea una sesión JWT cifrada;
4. `src/proxy.ts` realiza una comprobación preliminar para las rutas `/admin`;
5. el layout protegido consulta PostgreSQL y confirma que el administrador siga activo;
6. cerrar sesión invalida la cookie y redirige a `/admin/login`.

## Variables de entorno

Además de `DATABASE_URL` y `DIRECT_URL`, `.env.local` necesita:

```dotenv
AUTH_SECRET="un-secreto-aleatorio-seguro"
```

Se puede generar y guardar con:

```bash
npx auth secret
```

El secreto debe configurarse también en el entorno de despliegue. Nunca debe llevar el prefijo `NEXT_PUBLIC_` ni versionarse.

## Crear el primer administrador

La herramienta de consola usa variables temporales para evitar credenciales hardcodeadas. La contraseña debe tener al menos 12 caracteres y no superar 72 bytes, límite relevante para bcrypt.

PowerShell:

```powershell
$env:ADMIN_CORREO="admin@ejemplo.com"
$env:ADMIN_NOMBRE="Nombre visible"
$env:ADMIN_CONTRASENA="contraseña-temporal-segura"
npm run admin:crear
Remove-Item Env:ADMIN_CORREO, Env:ADMIN_NOMBRE, Env:ADMIN_CONTRASENA
```

Bash:

```bash
ADMIN_CORREO="admin@ejemplo.com" \
ADMIN_NOMBRE="Nombre visible" \
ADMIN_CONTRASENA="contraseña-temporal-segura" \
npm run admin:crear
```

Usar una terminal privada y evitar reutilizar la contraseña del ejemplo. El script normaliza el correo, valida los datos, rechaza duplicados, genera un hash bcrypt con costo 12 y persiste únicamente el hash. No es un seed y no carga información comercial.

## Seguridad y autorización

- Los mensajes de login son genéricos y no revelan si existe el correo.
- La comparación usa bcrypt incluso cuando el correo no existe para reducir diferencias de tiempo evidentes.
- La sesión sólo expone identificador, nombre y correo; nunca el hash.
- Un administrador inactivo no puede iniciar sesión.
- Cada render protegido consulta el registro activo, por lo que desactivarlo invalida el acceso efectivo aunque la cookie todavía no haya vencido.
- Las futuras acciones administrativas deberán llamar a la misma comprobación servidor y no confiar sólo en Proxy o en la interfaz.
- La sesión vence luego de ocho horas.
- El control de intentos deberá configurarse en la capa de despliegue antes de exponer el acceso públicamente; no se incorporó una dependencia de rate limiting en esta fase.

## Rutas

- `/admin/login`: formulario público de acceso.
- `/admin`: dashboard mínimo protegido.
- `/api/auth/*`: endpoints internos administrados por Auth.js.

Las tarjetas del dashboard son informativas. Los CRUD comienzan en fases posteriores.
