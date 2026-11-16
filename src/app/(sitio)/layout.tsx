import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProveedorCarrito } from "@/features/carrito/proveedor-carrito";

export default function LayoutSitioPublico({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ProveedorCarrito>
      <Header />
      {children}
      <Footer />
    </ProveedorCarrito>
  );
}
