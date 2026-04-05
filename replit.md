# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a Zomato-style food delivery web app called "Foodie".

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Wouter routing
- **State**: React Query (server state) + React Context (cart state)

## Artifacts

- **`artifacts/zomato-clone`** — Main food delivery web app (previewPath: `/`)
- **`artifacts/api-server`** — Express API server (previewPath: `/api`)

## App Features

- Homepage with hero, cuisine categories, featured restaurants
- Restaurant listing with cuisine filters and sort options
- Restaurant detail page with menu grouped by category, add-to-cart
- Cart with item management, bill breakdown, and order placement
- Order history and order detail with delivery tracking

## DB Schema

- `restaurants` — Restaurant listings with cuisine, rating, delivery info
- `menu_items` — Menu items per restaurant grouped by category
- `categories` — Cuisine categories with image URLs
- `orders` — Customer orders with items (JSON), status tracking

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
