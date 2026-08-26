# Platform Videos

Aplicacion Next.js preparada para desplegarse en Vercel y usar Supabase como backend.

## Requisitos

- Node.js 20.9 o superior
- pnpm 10 o superior

## Desarrollo

```bash
pnpm install
pnpm dev
```

Duplica `.env.example` como `.env.local` y completa las credenciales del proyecto Supabase antes de usar autenticacion o datos.

## Estructura

```text
src/
  app/                  Rutas y layouts del App Router
  components/           Componentes UI compartidos
  features/             Modulos de dominio y casos de uso
  lib/                  Integraciones y utilidades compartidas
    supabase/           Clientes browser, server y refresco de sesion
```

## Comandos

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Vercel

Importa el repositorio en Vercel y configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en los entornos correspondientes. El proyecto no requiere una configuracion `vercel.json` para el despliegue estandar de Next.js.
