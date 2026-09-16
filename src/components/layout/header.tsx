import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "Categorías", href: "#categorias" },
  { label: "Bandas", href: "#bandas" },
  { label: "El Local", href: "#local" },
  { label: "Contacto", href: "#contacto" },
] as const;

function Brand() {
  return (
    <Link
      href="#inicio"
      className="flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      aria-label="Alcohol Rockería, ir al inicio"
    >
      <Image
        src="/branding/alcohol-rockeria-logo.png"
        alt=""
        width={52}
        height={52}
        className="size-11 object-contain sm:size-12"
        priority
      />
      <span className="font-display text-lg font-bold uppercase leading-[0.9] tracking-[0.08em] text-foreground sm:text-xl">
        Alcohol
        <span className="block text-accent">Rockería</span>
      </span>
    </Link>
  );
}

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return navigation.map((item) => (
    <a
      key={item.href}
      href={item.href}
      className={
        mobile
          ? "flex min-h-11 items-center border-b border-border py-2 text-sm font-bold uppercase tracking-[0.11em] text-foreground transition-colors last:border-0 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          : "rounded-sm px-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-foreground-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      }
    >
      {item.label}
    </a>
  ));
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <Container className="flex min-h-18 items-center justify-between py-2">
        <Brand />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navegación principal"
        >
          <NavigationLinks />
        </nav>

        <details className="group relative lg:hidden">
          <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-sm border border-border bg-surface text-foreground transition-colors marker:content-none hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Abrir menú principal</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5 group-open:hidden"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="hidden size-5 group-open:block"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </summary>
          <nav
            className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(19rem,calc(100vw-2rem))] rounded-sm border border-border bg-surface p-3 shadow-elevated"
            aria-label="Navegación móvil"
          >
            <NavigationLinks mobile />
          </nav>
        </details>
      </Container>
    </header>
  );
}
