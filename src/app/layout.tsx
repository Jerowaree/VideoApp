import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Gana Dinero con Tareas Sencillas",
  description:
    "Plataforma de videos para ganar dinero viendo contenido de calidad.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
