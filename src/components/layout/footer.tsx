import Image from "next/image";

import { Container } from "@/components/ui/container";

const footerNavigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "El Local", href: "#local" },
] as const;

export function Footer() {
  return (
    <footer
      id="contacto"
      className="border-t border-border bg-background-secondary"
    >
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:py-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/branding/alcohol-rockeria-logo.png"
              alt=""
              width={64}
              height={64}
              className="size-14 object-contain"
            />
            <p className="font-display text-2xl font-bold uppercase leading-none tracking-wide">
              Alcohol <span className="text-accent">Rockería</span>
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-foreground-secondary">
            Desde 1990 junto al Rock. Un punto de encuentro para la cultura
            rockera de Rosario.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Navegación</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-10 items-center text-foreground-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">Encontranos</h2>
          <div className="mt-4 grid gap-3 text-sm text-foreground-secondary">
            <p>Instagram · Próximamente</p>
            <p>WhatsApp · Próximamente</p>
            <p>Dirección · A configurar</p>
          </div>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Alcohol Rockería.</p>
          <p>Sitio en desarrollo · Rosario, Argentina</p>
        </Container>
      </div>
    </footer>
  );
}
