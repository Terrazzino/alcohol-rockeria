import "server-only";

import { del, put } from "@vercel/blob";

const EXTENSIONES_POR_MIME = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export async function subirImagenProducto(productoId: string, archivo: File) {
  const extension =
    EXTENSIONES_POR_MIME[archivo.type as keyof typeof EXTENSIONES_POR_MIME];
  if (!extension) throw new Error("Formato de imagen no soportado.");

  return put(
    `productos/${productoId}/${crypto.randomUUID()}.${extension}`,
    archivo,
    {
      access: "public",
      addRandomSuffix: false,
      contentType: archivo.type,
    },
  );
}

export function eliminarImagenAlmacenada(rutaImagen: string) {
  return del(rutaImagen);
}
