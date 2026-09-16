import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alcohol Rockería | Desde 1990 junto al Rock",
  description: "Alcohol Rockería, la rockería histórica de Rosario.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#contenido-principal"
          className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-sm bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition-transform focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-foreground"
        >
          Saltar al contenido
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
