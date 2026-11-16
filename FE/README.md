# BloomCraft frontend

React + Vite + TypeScript frontend for BloomCraft.

## Prerequisites

- Node.js 22.12 or another runtime supported by Vite 8
- pnpm 9

## Local development

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

`VITE_API_BASE_URL` configures the Axios base URL. The current backend has no active
application endpoints, so the frontend does not make an API request yet.

## Commands

- `pnpm dev` starts the Vite development server.
- `pnpm build` type-checks and creates a production build.
- `pnpm lint` runs Oxlint.
- `pnpm preview` serves the production build locally.

## Source layout

- `src/app` contains app-wide providers and router configuration.
- `src/features` contains domain features and their pages/components.
- `src/shared` contains cross-feature API, configuration, form, layout, and UI code.
