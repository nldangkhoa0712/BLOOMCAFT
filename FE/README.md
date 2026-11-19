# BloomCraft frontend

React + Vite + TypeScript frontend for BloomCraft.

## Prerequisites

- Node.js 22.12 or another runtime supported by Vite 8
- pnpm 9

## Local development

```powershell
pnpm install
Copy-Item .env.example .env
pnpm dev
```

`VITE_API_BASE_URL` configures the Axios base URL. BloomCraft uses the same `.env`
filename for development and production builds; update its value on the build machine.
Vite embeds every `VITE_*` value into the client bundle, so never put secrets in this file.

Identity requests use credentialed CORS because the backend stores the refresh token in
an `HttpOnly` cookie. The backend `CORS_ORIGIN` must exactly match the frontend origin.
The local backend configured by this repository is `http://localhost:5432`.

## Commands

- `pnpm dev` starts the Vite development server.
- `pnpm build` type-checks and creates a production build.
- `pnpm lint` runs Oxlint.
- `pnpm test` runs the Vitest suite once.
- `pnpm preview` serves the production build locally.

## Source layout

- `src/app` contains app-wide providers, Redux store, TanStack Query, and router configuration.
- `src/features` contains domain features and their pages/components.
- `src/shared` contains cross-feature Axios clients, interceptors, configuration, form,
  layout, and UI code.
