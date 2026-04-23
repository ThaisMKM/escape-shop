# EscapeHub — Claude Context

Fictional escape room marketplace. React learning project, built with Bolt.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS |
| Backend / Auth / DB | Supabase (BaaS) |
| Payments | Not implemented yet — simulated |

## Key architectural decisions

- **No URL router** — navigation is done by changing a `currentPage` state variable in `App.tsx`
- **Auth** via Supabase Auth (email/password), session in localStorage, exposed via `AuthContext`
- **Purchases** are written directly from React to Supabase using the anon key + RLS (`auth.uid() = user_id`)
- **Backend for payments is undecided** — two options being considered:
  - Supabase Edge Functions (simpler, stays in one platform)
  - Go API (more control, good for learning Go)
  - Do not suggest Spring Boot — it was evaluated and ruled out
- React changes are minimal either way — only `usePurchases.ts` needs updating

## Important files

- `src/hooks/usePurchases.ts` — all purchase logic (fetch, buy, check ownership)
- `src/context/AuthContext.tsx` — global auth state
- `src/lib/supabase.ts` — single Supabase client instance
- `src/types/index.ts` — core app types
- `src/types/database.ts` — auto-generated Supabase DB types

## Docs

- `docs/ARCHITECTURE.md` — how the app is structured, backend options
- `docs/SUPABASE.md` — DB schema, RLS policies, env vars
- `docs/STRIPE.md` — future payment integration plan, key management, trade-offs
