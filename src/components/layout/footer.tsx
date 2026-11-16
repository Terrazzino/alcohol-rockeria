import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

const footerNavigation = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Productos", href: "/#productos" },
  { label: "Categorías", href: "/#categorias" },
  { label: "Bandas", href: "/#bandas" },
  { label: "El Local", href: "/#local" },
  { label: "Contacto", href: "/#contacto" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <Container className="grid gap-10 py-12 sm:grid-cols-[1.2fr_1fr] lg:py-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/branding/alcohol-rockeria-logo.png"
              alt=""
              width={64}
              height={64}
              className="size-14 object-contain"
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-foreground-secondary">
            Catálogo público y carrito de consulta.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Navegación</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center text-foreground-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()}. Todos los derechos reservados.</p>
          <Link
            href="/#contacto"
            className="rounded-sm transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Información y contacto
          </Link>
        </Container>
      </div>
    </footer>
  );
}
