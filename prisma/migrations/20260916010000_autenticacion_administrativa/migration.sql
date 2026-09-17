-- La base comienza sin administradores. Si existiera alguno, esta migración
-- debe detenerse porque no es posible inferir una contraseña segura.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "administradores") THEN
    RAISE EXCEPTION 'No se puede agregar hash_contrasena: existen administradores sin credenciales migrables';
  END IF;
END
$$;

ALTER TABLE "administradores"
  RENAME COLUMN "email" TO "correo";

ALTER TABLE "administradores"
  ADD COLUMN "hash_contrasena" TEXT NOT NULL,
  ADD COLUMN "nombre" TEXT;

ALTER INDEX "administradores_email_key"
  RENAME TO "administradores_correo_key";

ALTER TABLE "administradores"
  RENAME CONSTRAINT "administradores_email_no_vacio" TO "administradores_correo_no_vacio";

ALTER TABLE "administradores"
  RENAME CONSTRAINT "administradores_email_minuscula" TO "administradores_correo_minuscula";

ALTER TABLE "administradores"
  ADD CONSTRAINT "administradores_hash_bcrypt_valido" CHECK (char_length("hash_contrasena") = 60),
  ADD CONSTRAINT "administradores_nombre_no_vacio" CHECK ("nombre" IS NULL OR char_length(trim("nombre")) > 0);
