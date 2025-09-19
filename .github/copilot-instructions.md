# Copilot Instructions for srvc-worker

This file gives focused, actionable guidance for AI coding agents working on the `srvc-worker` repository.

Keep suggestions small, precise, and consistent with the project's existing patterns (Next.js app + API routes + Mongoose). Reference files and locations below when making changes.

1. Project Overview
- **Framework**: Next.js (app uses React 18 + Next 14). Key entry points: `src/app` for client pages and `src/pages/api` for serverless API routes.
- **Data layer**: MongoDB via Mongoose. Connection helper: `src/utils/db.ts` (reads `MONGO_DB_URI` from `.env.local`). Models in `src/models/*` (e.g. `Product.ts`).
- **Auth & middleware**: NextAuth configuration in `src/auth.config.ts` and `src/auth.ts`. Middleware behavior is declared in `auth.config.ts` (redirects to `/inventory` when unauthenticated).

2. Developer workflows & commands
- **Run locally**: `npm run dev` (uses `next dev`).
- **Build**: `npm run build`; **Start** (prod): `npm start`.
- **Lint**: `npm run lint`.
- **Env**: Local env reads `.env.local`. Important variable: `MONGO_DB_URI` used by `src/utils/db.ts`.

3. Patterns and conventions (do this in PRs)
- API routes: use `src/pages/api/*` (Next.js API route handlers). Look at `src/pages/api/products/index.ts` for the standard style: connect via `await connect()` and switch on `req.method`.
- Mongoose models: place in `src/models`. Use `mongoose.models.ModelName || mongoose.model(...)` to avoid re-declaration on hot reload (existing pattern in `Product.ts`).
- DB connect: use the `connect()` helper to reuse cached connections; do not instantiate `mongoose.connect` directly in routes.
- Responses: API handlers return `{ success: boolean, data?: any, error?: string }` shape—follow it for consistency.
- Client components: `src/app/components/index.tsx` exports many small components (e.g. `ProductForm`, `ProductList`, `Modal`). Prefer patching or extending those components rather than adding new top-level components unless necessary.

4. Files & locations to reference when implementing features
- UI: `src/app/**/*` (pages and components). Example page: `src/app/inventory/page.tsx`.
- API: `src/pages/api/*` (products, sales, register, settings, files, passKey). E.g. `src/pages/api/products/index.ts` and `src/pages/api/products/[id].ts`.
- Models: `src/models/*` (Product, Sale, User).
- Utils: `src/utils/db.ts` (DB connect).
- Auth: `src/auth.ts`, `src/auth.config.ts`, and `src/pages/api/auth/[...nextauth].ts`.

5. Integration notes & external dependencies
- Uses MongoDB via `mongoose` and expects `MONGO_DB_URI` in `.env.local`.
- Uses `next-auth` for authentication and `next` serverless APIs; sessions are stored in cookies (see middleware cookie name `next-auth.session-token`).
- Uses Vercel blob and analytics packages—image domains are configured in `next.config.mjs`.

6. PR guidance & safe edits
- Make small, isolated changes. For API changes, include tests or manual curl example when possible. Example: to test `GET /api/products` run `curl http://localhost:3000/api/products`.
- When adding/altering Mongoose schemas, preserve the `mongoose.models.Model || mongoose.model` pattern and migrate existing documents carefully.
- Env changes: do not hardcode secrets—use `.env.local` and mention new env vars in the PR description.

7. Common pitfalls observed
- `src/utils/db.ts` expects `.env.local` and throws if `MONGO_DB_URI` is missing—ensure env is present in CI/dev.
- Middleware and auth are combined in `auth.config.ts`; unexpected behavior may occur if modifying middleware matcher (`config.matcher`).
- API handlers generally expect request JSON shapes consistent with `BaseProduct` in `src/data/inventory.ts` and models in `src/models`.

If anything in these notes is unclear or you want more detail (examples of payloads, common response shapes, or CI/deploy specifics), tell me which area to expand.
