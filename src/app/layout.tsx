import type { Metadata } from "next";
import "./globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Gana Dinero con Tareas Sencillas",
  description:
    "Plataforma de videos para ganar dinero viendo contenido de calidad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
